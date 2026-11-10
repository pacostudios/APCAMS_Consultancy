import { and, asc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { booking, client, service } from "@/db/schema";
import { formatTime, formatWeekdayDate, zoneLabel } from "@/lib/format";
import { isStripeConfigured } from "@/lib/payments";
import { getUser } from "@/lib/user";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Book a session · APCAMS" };

export default async function BookAppointmentPage({ searchParams }: { searchParams: Promise<{ service?: string; payment?: string }> }) {
  const { service: initialSlug, payment } = await searchParams;
  // Visitors without an account confirm their email with a one-time code inside the form, which signs them in.
  const user = await getUser();
  // Admin and staff sessions don't count: they must sign out and book as a customer.
  const signedIn = user?.emailVerified && user.role === "client" ? user : null;
  const staffEmail = user && user.role !== "client" ? user.email : null;

  const services = db
    .select({ id: service.id, slug: service.slug, name: service.name, priceCents: service.priceCents, durationMins: service.durationMins })
    .from(service)
    .where(eq(service.active, true))
    .orderBy(asc(service.sortOrder))
    .all();

  const saved = signedIn
    ? db.select({ id: client.id, name: client.name, phone: client.phone, address: client.address }).from(client).where(eq(client.userId, signedIn.id)).get()
    : undefined;

  // A booking they left at the Stripe page (e.g. pressed Back) that is still holding its slot.
  const hold = saved
    ? db
        .select({ startsAt: booking.startsAt, holdExpiresAt: booking.holdExpiresAt, serviceName: service.name })
        .from(booking)
        .innerJoin(service, eq(service.id, booking.serviceId))
        .where(and(eq(booking.clientId, saved.id), eq(booking.status, "pending"), eq(booking.paymentStatus, "unpaid"), gt(booking.holdExpiresAt, new Date())))
        .get()
    : undefined;
  const pendingPayment = hold
    ? {
        serviceName: hold.serviceName,
        when: `${formatWeekdayDate(hold.startsAt)}, ${formatTime(hold.startsAt)} ${zoneLabel(hold.startsAt)}`,
        heldUntil: formatTime(hold.holdExpiresAt!),
      }
    : null;

  return (
    <BookingForm
      services={services}
      initialSlug={initialSlug ?? ""}
      paymentsEnabled={isStripeConfigured()}
      paymentCancelled={payment === "cancelled"}
      signedInEmail={signedIn?.email ?? null}
      staffEmail={staffEmail}
      pendingPayment={pendingPayment}
      // The name from their last booking wins: accounts made by code sign-in on /login start without one.
      defaults={{ name: saved?.name || signedIn?.name || "", phone: saved?.phone ?? "", address: saved?.address ?? "" }}
    />
  );
}
