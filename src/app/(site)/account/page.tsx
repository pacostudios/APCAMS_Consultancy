import Link from "next/link";
import { asc, desc, eq, and, gte, lt, inArray, or, notInArray, sql } from "drizzle-orm";
import { AlertCircle, ArrowUpRight, CalendarDays, CheckCircle2, Clock, CreditCard, Video } from "lucide-react";
import { db } from "@/db";
import { booking, service, type BookingStatus } from "@/db/schema";
import { clientForUser, releaseExpiredHolds } from "@/lib/bookings";
import { BUSINESS } from "@/lib/config";
import { formatAUD, formatTime, formatWeekdayDate, formatDate, zoneLabel } from "@/lib/format";
import { requireUser } from "@/lib/user";
import { cancelMyBookingAction, resumePaymentAction } from "./actions";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "My account · Alchemetanoia" };

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-teal-50 text-teal-700",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-600",
  no_show: "bg-slate-100 text-slate-500",
};

const ACTIVE: BookingStatus[] = ["pending", "confirmed"];

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string; payment?: string; cancel?: string }>;
}) {
  const user = await requireUser("/account");
  const me = clientForUser(user);
  const { booked, payment, cancel } = await searchParams;
  const now = new Date();
  releaseExpiredHolds(now);

  const columns = {
    id: booking.id,
    reference: booking.reference,
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    status: booking.status,
    mode: booking.mode,
    meetingUrl: booking.meetingUrl,
    paymentStatus: booking.paymentStatus,
    holdExpiresAt: booking.holdExpiresAt,
    amountPaidCents: booking.amountPaidCents,
    paidAt: booking.paidAt,
    paymentMethod: booking.paymentMethod,
    receiptUrl: booking.receiptUrl,
    refundedAt: booking.refundedAt,
    serviceName: service.name,
  };

  // A session stays "upcoming" until it ends, so the Join button works during the session.
  const upcoming = db
    .select(columns)
    .from(booking)
    .innerJoin(service, eq(service.id, booking.serviceId))
    .where(and(eq(booking.clientId, me.id), inArray(booking.status, ACTIVE), gte(booking.endsAt, now)))
    .orderBy(asc(booking.startsAt))
    .all();

  const past = db
    .select(columns)
    .from(booking)
    .innerJoin(service, eq(service.id, booking.serviceId))
    .where(
      and(
        eq(booking.clientId, me.id),
        or(lt(booking.endsAt, now), notInArray(booking.status, ACTIVE)),
        // Abandoned payment pages aren't real bookings; leave them out of the history.
        sql`not (${booking.status} = 'cancelled' and ${booking.paymentStatus} = 'unpaid' and ${booking.stripeCheckoutSessionId} is not null)`,
      ),
    )
    .orderBy(desc(booking.startsAt))
    .limit(20)
    .all();

  // Only confirm references that really are this customer's booking.
  const justBooked = upcoming.find((b) => b.reference === booked && b.status === "confirmed");
  const awaitingPayment = (b: (typeof upcoming)[number]) => b.status === "pending" && b.paymentStatus === "unpaid" && b.holdExpiresAt !== null;

  const canCancel = (startsAt: Date) => startsAt.getTime() - now.getTime() >= BUSINESS.cancelNoticeHours * 3_600_000;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-20 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em]">My account</p>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Hi, {user.name.split(" ")[0]}</h1>
          <p className="text-slate-500 font-medium">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/book_appointment"
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-teal-600 transition-colors"
          >
            Book a session <ArrowUpRight size={16} />
          </Link>
          <SignOutButton />
        </div>
      </div>

      {justBooked && (
        <div role="status" className="flex items-start gap-4 rounded-[2rem] border border-teal-100 bg-teal-50 p-6">
          <CheckCircle2 className="text-teal-600 shrink-0" size={24} />
          <div>
            <p className="font-bold text-slate-900">Your session is booked. Reference {justBooked.reference}.</p>
            <p className="text-sm text-slate-600 mt-1">
              {justBooked.meetingUrl
                ? "Your Zoom link is below. Join a few minutes early and you'll be let in from the waiting room."
                : "We'll add your Zoom link here before the session."}
            </p>
          </div>
        </div>
      )}

      {payment === "refunded" && (
        <Notice tone="warn" title="That time was taken while you were paying">
          Your payment has been refunded in full. It can take 5–10 business days to appear. Please choose another time.
        </Notice>
      )}
      {payment === "processing" && (
        <Notice tone="info" title="We're confirming your payment">
          This usually takes a few seconds. Refresh this page shortly; we&apos;ll also email you once it&apos;s confirmed.
        </Notice>
      )}
      {cancel === "failed" && (
        <Notice tone="warn" title="We couldn't cancel that session">
          The refund didn&apos;t go through, so your booking is unchanged. Please try again or <Link href="/contact_us" className="underline">contact us</Link>.
        </Notice>
      )}

      {/* Upcoming */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Upcoming sessions</h2>
        {upcoming.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-slate-100 p-10 text-center space-y-4">
            <CalendarDays className="mx-auto text-slate-300" size={32} />
            <p className="text-slate-500 font-medium">You have no upcoming sessions.</p>
            <Link href="/book_appointment" className="inline-block font-bold text-teal-600 hover:underline">Book your first session</Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((b) => (
              <li key={b.id} className="rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{b.serviceName}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[b.status]}`}>
                      {awaitingPayment(b) ? "awaiting payment" : b.status}
                    </span>
                    {b.paymentStatus === "paid" && <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">Paid</span>}
                  </div>
                  <p className="flex items-center gap-2 text-slate-600 font-medium">
                    <Clock size={16} className="text-teal-600" />
                    {formatWeekdayDate(b.startsAt)}, {formatTime(b.startsAt)} – {formatTime(b.endsAt)} {zoneLabel(b.startsAt)}
                  </p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ref {b.reference}</p>
                  <PaymentLine b={b} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:items-center">
                  {awaitingPayment(b) ? (
                    <>
                      <form action={resumePaymentAction}>
                        <input type="hidden" name="id" value={b.id} />
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-teal-700 transition-colors">
                          <CreditCard size={16} /> Complete payment
                        </button>
                      </form>
                      <form action={cancelMyBookingAction}>
                        <input type="hidden" name="id" value={b.id} />
                        <button className="w-full px-6 py-3 rounded-full border-2 border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest hover:border-red-200 hover:text-red-600 transition-colors">
                          Release time
                        </button>
                      </form>
                      <p className="text-[11px] text-slate-400 max-w-[12rem]">Held for you until {formatTime(b.holdExpiresAt!)}. Pay before then to confirm.</p>
                    </>
                  ) : (
                  <>
                  {b.meetingUrl ? (
                    <a
                      href={b.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-teal-700 transition-colors"
                    >
                      <Video size={16} /> Join Zoom
                    </a>
                  ) : b.mode === "online" ? (
                    <p className="text-xs text-slate-500 max-w-[14rem]">Your Zoom link will appear here before the session.</p>
                  ) : (
                    <p className="text-xs text-slate-500">In-person session</p>
                  )}
                  {canCancel(b.startsAt) ? (
                    <form action={cancelMyBookingAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <button className="w-full px-6 py-3 rounded-full border-2 border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest hover:border-red-200 hover:text-red-600 transition-colors">
                        {b.paymentStatus === "paid" ? "Cancel & refund" : "Cancel"}
                      </button>
                    </form>
                  ) : (
                    <p className="text-[11px] text-slate-400 max-w-[12rem]">
                      Less than {BUSINESS.cancelNoticeHours}h away. To change it, please <Link href="/contact_us" className="underline">contact us</Link>.
                    </p>
                  )}
                  </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* History */}
      {past.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Past &amp; cancelled</h2>
          <ul className="divide-y divide-slate-100 rounded-[2rem] border border-slate-100 bg-white">
            {past.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="font-bold text-slate-800">{b.serviceName}</p>
                  <p className="text-sm text-slate-500">{formatDate(b.startsAt)}, {formatTime(b.startsAt)}</p>
                  <PaymentLine b={b} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[b.status]}`}>
                  {b.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Notice({ tone, title, children }: { tone: "warn" | "info"; title: string; children: React.ReactNode }) {
  const styles = tone === "warn" ? "border-amber-100 bg-amber-50 text-amber-600" : "border-teal-100 bg-teal-50 text-teal-600";
  return (
    <div role="status" className={`flex items-start gap-4 rounded-[2rem] border p-6 ${styles}`}>
      <AlertCircle className="shrink-0" size={24} />
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600 mt-1">{children}</p>
      </div>
    </div>
  );
}

/** "Paid A$180.00 on 2 Nov 2026 · Visa •••• 4242 · Receipt", or the refund equivalent. */
function PaymentLine({
  b,
}: {
  b: { paymentStatus: string; amountPaidCents: number | null; paidAt: Date | null; paymentMethod: string | null; receiptUrl: string | null; refundedAt: Date | null };
}) {
  if (b.amountPaidCents == null || b.paymentStatus === "unpaid") return null;
  const amount = formatAUD(b.amountPaidCents);
  return (
    <p className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
      <CreditCard size={14} className="text-teal-600" />
      {b.paymentStatus === "refunded"
        ? `${amount} refunded${b.refundedAt ? ` on ${formatDate(b.refundedAt)}` : ""}`
        : `Paid ${amount}${b.paidAt ? ` on ${formatDate(b.paidAt)}` : ""}`}
      {b.paymentMethod && <span>· {b.paymentMethod}</span>}
      {b.receiptUrl && (
        <a href={b.receiptUrl} target="_blank" rel="noreferrer" className="font-bold text-teal-600 hover:underline">
          · Receipt
        </a>
      )}
    </p>
  );
}
