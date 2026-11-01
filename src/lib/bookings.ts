import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq, gt, lt, ne } from "drizzle-orm";
import { db } from "@/db";
import { availability, blockedDate, booking, client, service, type BookingMode } from "@/db/schema";
import { addDaysToKey, fromBusinessTime, startOfBusinessDay, weekdayOfKey } from "./format";

export class BookingError extends Error {}

/** Short, human-friendly booking reference, e.g. "APC-7F3K2Q". */
export function newReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const bytes = randomBytes(6);
  return "APC-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/** Active (non-cancelled) bookings overlapping [start, end), optionally ignoring one booking. */
export function findOverlap(start: Date, end: Date, ignoreId?: number) {
  return db
    .select({ id: booking.id, reference: booking.reference })
    .from(booking)
    .where(
      and(
        ne(booking.status, "cancelled"),
        lt(booking.startsAt, end),
        gt(booking.endsAt, start),
        ignoreId ? ne(booking.id, ignoreId) : undefined,
      ),
    )
    .get();
}

/**
 * Free start times for a service on a business-time date ("YYYY-MM-DD").
 * Slots step by the service duration from the start of each working-hours block.
 */
export function getAvailableSlots(dateKey: string, serviceId: number, now = new Date()) {
  const svc = db.select().from(service).where(eq(service.id, serviceId)).get();
  if (!svc || !svc.active) return [];

  if (db.select().from(blockedDate).where(eq(blockedDate.date, dateKey)).get()) return [];

  const rules = db.select().from(availability).where(eq(availability.weekday, weekdayOfKey(dateKey))).all();
  if (rules.length === 0) return [];

  const dayStart = startOfBusinessDay(dateKey);
  const dayEnd = startOfBusinessDay(addDaysToKey(dateKey, 1));
  const taken = db
    .select({ startsAt: booking.startsAt, endsAt: booking.endsAt })
    .from(booking)
    .where(and(ne(booking.status, "cancelled"), lt(booking.startsAt, dayEnd), gt(booking.endsAt, dayStart)))
    .all();

  const durationMs = svc.durationMins * 60_000;
  const slots: Date[] = [];

  for (const rule of rules) {
    const blockEnd = fromBusinessTime(`${dateKey}T${rule.endTime}`).getTime();
    for (let t = fromBusinessTime(`${dateKey}T${rule.startTime}`).getTime(); t + durationMs <= blockEnd; t += durationMs) {
      const end = t + durationMs;
      if (t <= now.getTime()) continue;
      const clash = taken.some((b) => b.startsAt.getTime() < end && b.endsAt.getTime() > t);
      if (!clash) slots.push(new Date(t));
    }
  }
  return slots.sort((a, b) => a.getTime() - b.getTime());
}

export type ClientInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

/** Find a client by email (then phone), creating or refreshing their details. */
export function upsertClient(input: ClientInput) {
  const email = input.email?.trim().toLowerCase() || null;
  const phone = input.phone?.trim() || null;

  const existing =
    (email && db.select().from(client).where(eq(client.email, email)).get()) ||
    (phone && db.select().from(client).where(eq(client.phone, phone)).get()) ||
    undefined;

  if (existing) {
    return db
      .update(client)
      .set({
        name: input.name || existing.name,
        email: email ?? existing.email,
        phone: phone ?? existing.phone,
        address: input.address || existing.address,
      })
      .where(eq(client.id, existing.id))
      .returning()
      .get();
  }
  return db
    .insert(client)
    .values({ name: input.name, email, phone, address: input.address || null })
    .returning()
    .get();
}

export type CreateBookingInput = {
  clientId: number;
  serviceId: number;
  startsAt: Date;
  mode?: BookingMode;
  status?: "pending" | "confirmed";
  clientNotes?: string | null;
  adminNotes?: string | null;
  meetingUrl?: string | null;
};

/** Create a booking, refusing if it overlaps an existing one. Runs in a single write transaction. */
export function createBooking(input: CreateBookingInput) {
  return db.transaction((tx) => {
    const svc = tx.select().from(service).where(eq(service.id, input.serviceId)).get();
    if (!svc) throw new BookingError("Service not found.");

    const endsAt = new Date(input.startsAt.getTime() + svc.durationMins * 60_000);
    const clash = findOverlap(input.startsAt, endsAt);
    if (clash) throw new BookingError(`That time overlaps booking ${clash.reference}.`);

    return tx
      .insert(booking)
      .values({
        reference: newReference(),
        clientId: input.clientId,
        serviceId: svc.id,
        startsAt: input.startsAt,
        endsAt,
        status: input.status ?? "pending",
        mode: input.mode ?? "in_person",
        priceCents: svc.priceCents,
        clientNotes: input.clientNotes || null,
        adminNotes: input.adminNotes || null,
        meetingUrl: input.meetingUrl || null,
      })
      .returning()
      .get();
  });
}
