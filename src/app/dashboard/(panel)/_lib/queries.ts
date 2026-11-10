import "server-only";
import { asc, desc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { releaseExpiredHolds } from "@/lib/bookings";
import { auditLog, booking, client, service, staff, user } from "@/db/schema";

/** Bookings joined with their client, service and staff names. */
export function listBookings({ where, order = "asc", limit, offset }: {
  where?: SQL;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}) {
  releaseExpiredHolds(); // so abandoned payment holds show as cancelled, not pending
  let q = db
    .select({
      id: booking.id,
      reference: booking.reference,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      status: booking.status,
      mode: booking.mode,
      priceCents: booking.priceCents,
      paymentStatus: booking.paymentStatus,
      meetingUrl: booking.meetingUrl,
      amountPaidCents: booking.amountPaidCents,
      paidAt: booking.paidAt,
      paymentMethod: booking.paymentMethod,
      stripePaymentIntentId: booking.stripePaymentIntentId,
      refundedAt: booking.refundedAt,
      createdAt: booking.createdAt,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      serviceId: service.id,
      serviceName: service.name,
      staffId: booking.staffId,
      staffName: user.name,
    })
    .from(booking)
    .innerJoin(client, eq(booking.clientId, client.id))
    .innerJoin(service, eq(booking.serviceId, service.id))
    .leftJoin(staff, eq(booking.staffId, staff.id))
    .leftJoin(user, eq(staff.userId, user.id))
    .where(where)
    .orderBy(order === "asc" ? asc(booking.startsAt) : desc(booking.startsAt))
    .$dynamic();
  if (limit) q = q.limit(limit);
  if (offset) q = q.offset(offset);
  return q.all();
}

export type BookingRow = ReturnType<typeof listBookings>[number];

/** Audit log entries, newest first. */
export function listAudit({ where, limit = 50, offset = 0 }: { where?: SQL; limit?: number; offset?: number } = {}) {
  return db.select().from(auditLog).where(where).orderBy(desc(auditLog.createdAt), desc(auditLog.id)).limit(limit).offset(offset).all();
}
