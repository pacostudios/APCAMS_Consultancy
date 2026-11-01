import "server-only";
import { asc, desc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { booking, client, service } from "@/db/schema";

/** Bookings joined with their client and service names. */
export function listBookings({ where, order = "asc", limit, offset }: {
  where?: SQL;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}) {
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
      createdAt: booking.createdAt,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      serviceId: service.id,
      serviceName: service.name,
    })
    .from(booking)
    .innerJoin(client, eq(booking.clientId, client.id))
    .innerJoin(service, eq(booking.serviceId, service.id))
    .where(where)
    .orderBy(order === "asc" ? asc(booking.startsAt) : desc(booking.startsAt))
    .$dynamic();
  if (limit) q = q.limit(limit);
  if (offset) q = q.offset(offset);
  return q.all();
}

export type BookingRow = ReturnType<typeof listBookings>[number];
