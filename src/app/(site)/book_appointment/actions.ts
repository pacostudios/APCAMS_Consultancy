"use server";

import { and, count, eq, gt, gte, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { booking, client, service, user as userTable } from "@/db/schema";
import { BookingError, clientForUser, createBooking, getAvailableSlots, releaseExpiredHolds } from "@/lib/bookings";
import { actorFrom } from "@/lib/audit";
import { BUSINESS } from "@/lib/config";
import { toDateKey } from "@/lib/format";
import { HOLD_MS, finaliseConfirmedBooking, isStripeConfigured, releaseCheckout, startCheckout, stripe } from "@/lib/payments";
import { getUser } from "@/lib/user";

const inputSchema = z.object({
  serviceId: z.number().int().positive("Choose a service."),
  start: z.iso.datetime({ message: "Choose a time." }),
  name: z.string().trim().min(1, "Enter your name.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{8,20}$/, "Enter a valid phone number."),
  address: z.string().trim().max(200).optional(),
  // Spam traps: `website` is a hidden field humans never fill; `elapsedMs` is time spent on the form.
  website: z.string().optional(),
  elapsedMs: z.number(),
});

export type BookSessionInput = z.input<typeof inputSchema>;

const MIN_FILL_MS = 4_000;
const MAX_ATTEMPTS_PER_HOUR = 5;

export async function bookSessionAction(input: BookSessionInput): Promise<{ error: string }> {
  const user = await getUser();
  if (!user || !user.emailVerified) return { error: "Please sign in to book a session." };
  if (user.role !== "client") return { error: "Staff and admin accounts can't book here. Please sign out and book as a customer." };

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  // Bots fill hidden fields and submit instantly. Give them a vague error.
  if (d.website || d.elapsedMs < MIN_FILL_MS) return { error: "Something went wrong. Please try again." };

  const me = clientForUser(user);
  // Starting a new booking replaces any payment they left unfinished (e.g. pressed Back on Stripe), freeing that slot.
  await releaseMyHolds(me.id);
  const now = new Date();
  releaseExpiredHolds(now); // abandoned payments shouldn't count towards the limits below

  const [{ recent }] = db
    .select({ recent: count() })
    .from(booking)
    .where(and(eq(booking.clientId, me.id), gt(booking.createdAt, new Date(now.getTime() - 3_600_000))))
    .all();
  if (recent >= MAX_ATTEMPTS_PER_HOUR) return { error: "You've made several bookings in the last hour. Please try again later or contact us." };

  const [{ upcoming }] = db
    .select({ upcoming: count() })
    .from(booking)
    .where(and(eq(booking.clientId, me.id), inArray(booking.status, ["pending", "confirmed"]), gte(booking.startsAt, now)))
    .all();
  if (upcoming >= BUSINESS.maxUpcomingPerClient) {
    return { error: `You already have ${upcoming} upcoming sessions. Please attend or cancel one before booking another.` };
  }

  // Only accept a start time the public slot list would actually offer.
  const startsAt = new Date(d.start);
  const offered = getAvailableSlots(toDateKey(startsAt), d.serviceId, now);
  if (!offered.some((t) => t.getTime() === startsAt.getTime())) {
    return { error: "Sorry, that time is no longer available. Please pick another." };
  }

  db.update(client)
    .set({ name: d.name, phone: d.phone, address: d.address || me.address })
    .where(eq(client.id, me.id))
    .run();
  // Accounts made by code sign-in on /login have no name yet; use the one they just booked with.
  if (!user.name) db.update(userTable).set({ name: d.name }).where(eq(userTable.id, user.id)).run();

  // Paid sessions hold the slot while the customer pays; free ones (or no Stripe keys, in development) confirm now.
  const svc = db.select({ priceCents: service.priceCents }).from(service).where(eq(service.id, d.serviceId)).get();
  const needsPayment = (svc?.priceCents ?? 0) > 0 && isStripeConfigured();
  if (!needsPayment && (svc?.priceCents ?? 0) > 0) console.warn("[payments] STRIPE_SECRET_KEY unset: confirming a paid booking without payment.");

  let created;
  try {
    created = createBooking({
      clientId: me.id,
      serviceId: d.serviceId,
      startsAt,
      mode: "online",
      status: needsPayment ? "pending" : "confirmed",
      holdExpiresAt: needsPayment ? new Date(Date.now() + HOLD_MS) : null,
      actor: actorFrom(user),
    });
  } catch (e) {
    if (e instanceof BookingError) return { error: "Sorry, that time is no longer available. Please pick another." };
    // Two people submitting the same slot at once: the unique index rejects the second.
    if (e instanceof Error && "code" in e && String(e.code).startsWith("SQLITE_CONSTRAINT")) {
      return { error: "Sorry, someone just booked that time. Please pick another." };
    }
    throw e;
  }
  revalidatePath("/dashboard", "layout");

  if (!needsPayment) {
    await finaliseConfirmedBooking(created.id);
    redirect(`/account?booked=${created.reference}`);
  }

  let checkoutUrl: string;
  try {
    checkoutUrl = await startCheckout(created.id, user.email);
  } catch (e) {
    console.error("[payments] Could not start Stripe Checkout:", e);
    db.update(booking).set({ status: "cancelled" }).where(eq(booking.id, created.id)).run();
    return { error: "We couldn't open the payment page. Please try again in a moment." };
  }
  redirect(checkoutUrl);
}

/** The signed-in customer's booking that is still waiting for payment, if any. */
function myHold(clientId: number) {
  return db
    .select()
    .from(booking)
    .where(and(eq(booking.clientId, clientId), eq(booking.status, "pending"), eq(booking.paymentStatus, "unpaid"), gt(booking.holdExpiresAt, new Date())))
    .get();
}

async function releaseMyHolds(clientId: number) {
  const holds = db
    .select({ sessionId: booking.stripeCheckoutSessionId })
    .from(booking)
    .where(and(eq(booking.clientId, clientId), eq(booking.status, "pending"), eq(booking.paymentStatus, "unpaid")))
    .all();
  for (const h of holds) if (h.sessionId) await releaseCheckout(h.sessionId);
}

/** Sends the customer back to the Stripe page of their unfinished payment, if it's still open. */
export async function resumePaymentAction(): Promise<{ error: string }> {
  const user = await getUser();
  if (!user || user.role !== "client") return { error: "Please sign in again." };
  const hold = myHold(clientForUser(user).id);
  if (!hold?.stripeCheckoutSessionId) return { error: "That booking is no longer waiting for payment. Please choose a time again." };

  let url: string | null = null;
  try {
    const session = await stripe().checkout.sessions.retrieve(hold.stripeCheckoutSessionId);
    if (session.status === "open") url = session.url;
  } catch (e) {
    console.error("[payments] Could not reopen Checkout:", e);
  }
  if (!url) {
    await releaseCheckout(hold.stripeCheckoutSessionId);
    revalidatePath("/book_appointment");
    return { error: "That payment page has expired, so the time was released. Please choose a time again." };
  }
  redirect(url);
}

/** Cancels the customer's unfinished payment and frees the slot straight away. */
export async function cancelPendingPaymentAction() {
  const user = await getUser();
  if (!user || user.role !== "client") return;
  await releaseMyHolds(clientForUser(user).id);
  revalidatePath("/book_appointment");
  revalidatePath("/dashboard", "layout");
}
