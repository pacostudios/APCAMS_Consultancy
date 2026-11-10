import "server-only";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { booking, client, service } from "@/db/schema";
import { SYSTEM_ACTOR, logAudit } from "./audit";
import { attachZoomMeeting, findOverlap, pickStaff, staffName } from "./bookings";
import { BUSINESS } from "./config";
import { sendEmail, simpleEmail } from "./email";
import { formatAUD, formatTime, formatWeekdayDate, zoneLabel } from "./format";
import { notifyStaff } from "./staff";

/*
 * Payment flow for online bookings:
 *   1. The booking is created as "pending" with a hold, and the customer goes to Stripe Checkout.
 *   2. When Stripe reports it paid (success redirect or webhook, whichever is first) the booking is
 *      confirmed, then the Zoom meeting and confirmation email are created. Both paths are idempotent.
 *   3. If they cancel or never pay, the hold is released and the slot is free again.
 */

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

let client_: Stripe | null = null;
export function stripe() {
  client_ ??= new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client_;
}

const siteUrl = () => process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

/** Stripe's shortest allowed Checkout expiry is 30 minutes; 31 leaves room for clock skew. */
const CHECKOUT_MINUTES = 31;
/** Our hold outlasts the Checkout page a little, so a payment submitted at the last second still lands. */
export const HOLD_MS = (CHECKOUT_MINUTES + 4) * 60_000;

/** Link to a payment in the Stripe dashboard (test or live). */
export function stripePaymentUrl(paymentIntentId: string) {
  const test = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test") ? "test/" : "";
  return `https://dashboard.stripe.com/${test}payments/${paymentIntentId}`;
}

/** Creates the Checkout page for a pending booking and returns its URL. */
export async function startCheckout(bookingId: number, customerEmail: string) {
  const row = db
    .select({ b: booking, serviceName: service.name })
    .from(booking)
    .innerJoin(service, eq(service.id, booking.serviceId))
    .where(eq(booking.id, bookingId))
    .get();
  if (!row) throw new Error(`Booking ${bookingId} not found`);
  const { b, serviceName } = row;

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    client_reference_id: b.reference,
    // International visitors see the price converted to their local currency; the business still receives AUD.
    adaptive_pricing: { enabled: true },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: BUSINESS.currency.toLowerCase(),
          unit_amount: b.priceCents,
          product_data: {
            name: `${serviceName} (online session)`,
            description: `${formatWeekdayDate(b.startsAt)}, ${formatTime(b.startsAt)} ${zoneLabel(b.startsAt)} · Ref ${b.reference}`,
          },
        },
      },
    ],
    metadata: { bookingId: String(b.id), reference: b.reference },
    payment_intent_data: { metadata: { bookingId: String(b.id), reference: b.reference } },
    expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_MINUTES * 60,
    success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
  });

  db.update(booking).set({ stripeCheckoutSessionId: session.id }).where(eq(booking.id, b.id)).run();
  return session.url!;
}

export type FulfilOutcome = "confirmed" | "already" | "refunded" | "unpaid" | "missing";

/**
 * Confirms the booking behind a paid Checkout session. Safe to call any number of times.
 * If the hold had lapsed and someone else took the slot meanwhile, the payment is refunded instead.
 */
export async function fulfilCheckout(sessionId: string): Promise<{ outcome: FulfilOutcome; reference: string | null }> {
  const session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ["payment_intent.latest_charge"] });
  const reference = session.client_reference_id;
  if (session.payment_status !== "paid") return { outcome: "unpaid", reference };

  const bookingId = Number(session.metadata?.bookingId);
  const intent = typeof session.payment_intent === "object" ? session.payment_intent : null;
  const paymentIntentId = intent?.id ?? (session.payment_intent as string | null);
  const charge = intent && typeof intent.latest_charge === "object" ? intent.latest_charge : null;
  const record = {
    stripePaymentIntentId: paymentIntentId,
    amountPaidCents: session.amount_total,
    paidAt: charge ? new Date(charge.created * 1000) : new Date(),
    paymentMethod: charge ? describeMethod(charge) : null,
    receiptUrl: charge?.receipt_url ?? null,
  };

  // Synchronous SQLite transaction: only one caller can move the booking out of "unpaid".
  const outcome = db.transaction((): FulfilOutcome | "conflict" => {
    const b = db.select().from(booking).where(eq(booking.id, bookingId)).get();
    if (!b) return "missing";
    if (b.paymentStatus !== "unpaid") return "already";
    // The hold lapsed and the staff member's slot was taken meanwhile: hand it to another free staff member if possible.
    let staffId = b.staffId;
    if (b.status === "cancelled" && findOverlap(b.staffId, b.startsAt, b.endsAt, b.id)) {
      staffId = pickStaff(b.serviceId, b.startsAt, b.endsAt);
      if (!staffId) {
        db.update(booking).set({ ...record, paymentStatus: "paid" }).where(eq(booking.id, b.id)).run();
        logAudit({
          actor: SYSTEM_ACTOR,
          action: "status_changed",
          bookingId: b.id,
          staffId: b.staffId,
          summary: `${b.reference}: paid after the payment hold lapsed and the slot was taken; refunding.`,
        });
        return "conflict";
      }
    }
    db.update(booking)
      .set({ ...record, staffId, status: "confirmed", paymentStatus: "paid", holdExpiresAt: null })
      .where(eq(booking.id, b.id))
      .run();
    logAudit({
      actor: SYSTEM_ACTOR,
      action: "status_changed",
      bookingId: b.id,
      staffId,
      summary:
        `${b.reference}: payment received, booking confirmed` +
        (staffId !== b.staffId ? `; reassigned from ${staffName(b.staffId)} to ${staffName(staffId)} as the slot was taken.` : "."),
      details: { from: b.status, to: "confirmed", amountPaidCents: record.amountPaidCents },
    });
    return "confirmed";
  });

  if (outcome === "conflict") {
    console.warn(`[payments] Booking ${bookingId} was paid after its slot was taken; refunding.`);
    await refundBooking(bookingId);
    return { outcome: "refunded", reference };
  }
  if (outcome === "confirmed") await finaliseConfirmedBooking(bookingId);
  return { outcome, reference };
}

/** Zoom meeting + confirmation email for a booking that has just been confirmed. */
export async function finaliseConfirmedBooking(bookingId: number) {
  const meetingUrl = await attachZoomMeeting(bookingId);
  await sendBookingConfirmation(bookingId, meetingUrl).catch(console.error);
  await notifyStaff(bookingId, "assigned");
}

/** Customer backed out of Checkout (or it expired): close the session and free the slot. */
export async function releaseCheckout(sessionId: string) {
  const b = db.select().from(booking).where(eq(booking.stripeCheckoutSessionId, sessionId)).get();
  if (!b || b.paymentStatus !== "unpaid") return b ?? null;

  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    if (session.status === "open") await stripe().checkout.sessions.expire(sessionId);
    if (session.payment_status === "paid") return b; // paid after all: let fulfilment handle it
  } catch (e) {
    console.error(`[payments] Could not expire Checkout session ${sessionId}:`, e);
  }
  if (b.status === "pending") db.update(booking).set({ status: "cancelled" }).where(eq(booking.id, b.id)).run();
  return b;
}

/** Full refund of a paid booking. Throws if Stripe refuses, so callers can show the error. */
export async function refundBooking(bookingId: number) {
  const b = db.select().from(booking).where(eq(booking.id, bookingId)).get();
  if (!b?.stripePaymentIntentId || b.paymentStatus === "refunded") return;
  await stripe().refunds.create(
    { payment_intent: b.stripePaymentIntentId, reason: "requested_by_customer" },
    { idempotencyKey: `refund-booking-${b.id}` },
  );
  db.update(booking).set({ paymentStatus: "refunded", refundedAt: new Date() }).where(eq(booking.id, b.id)).run();
}

const BRANDS: Record<string, string> = {
  visa: "Visa", mastercard: "Mastercard", amex: "Amex", eftpos_au: "eftpos", jcb: "JCB",
  diners: "Diners", discover: "Discover", unionpay: "UnionPay",
};
const WALLETS: Record<string, string> = { apple_pay: "Apple Pay", google_pay: "Google Pay", link: "Link" };

/** Human label for how a charge was paid, e.g. "Apple Pay · Visa •••• 4242". */
function describeMethod(charge: Stripe.Charge) {
  const details = charge.payment_method_details;
  const card = details?.card;
  if (!card) return details?.type ? details.type.replace(/_/g, " ") : null;
  const label = `${BRANDS[card.brand ?? ""] ?? "Card"} •••• ${card.last4}`;
  const wallet = card.wallet?.type ? WALLETS[card.wallet.type] : null;
  return wallet ? `${wallet} · ${label}` : label;
}

async function sendBookingConfirmation(bookingId: number, meetingUrl: string | null) {
  const row = db
    .select({ b: booking, serviceName: service.name, email: client.email })
    .from(booking)
    .innerJoin(service, eq(service.id, booking.serviceId))
    .innerJoin(client, eq(client.id, booking.clientId))
    .where(eq(booking.id, bookingId))
    .get();
  if (!row?.email) return;
  const { b } = row;
  const when = `${formatWeekdayDate(b.startsAt)} at ${formatTime(b.startsAt)} ${zoneLabel(b.startsAt)}`;
  const { html, text } = simpleEmail({
    heading: "Your session is booked",
    body:
      `${row.serviceName} on ${when} (ref ${b.reference}). ` +
      (b.paymentStatus === "paid"
        ? `Payment of ${formatAUD(b.amountPaidCents ?? b.priceCents)} received${b.paymentMethod ? ` (${b.paymentMethod})` : ""}, thank you.${b.receiptUrl ? ` Receipt: ${b.receiptUrl}.` : ""} `
        : "") +
      (meetingUrl ? `Join on Zoom: ${meetingUrl}. ` : "We'll send your Zoom link before the session. ") +
      `You can view or cancel it from your account up to ${BUSINESS.cancelNoticeHours} hours before.`,
    cta: "View my sessions",
    url: `${siteUrl()}/account`,
  });
  await sendEmail({ to: row.email, subject: `Booking confirmed: ${when}`, html, text });
}
