import "server-only";
import { randomBytes } from "node:crypto";
import { and, count, eq, gt, gte, isNull, lt, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  blockedDate, booking, client, service, staff, staffHours, staffService, staffTimeOff, user,
  type BookingMode, type BookingStatus,
} from "@/db/schema";
import { logAudit, type Actor } from "./audit";
import { addDaysToKey, formatDateTime, fromBusinessTime, startOfBusinessDay, toDateKey, weekdayOfKey } from "./format";
import { createZoomMeeting, deleteZoomMeeting, isZoomConfigured, rescheduleZoomMeeting } from "./zoom";

export class BookingError extends Error {}

/** Short, human-friendly booking reference, e.g. "APC-7F3K2Q". */
export function newReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const bytes = randomBytes(6);
  return "APC-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/**
 * Active (non-cancelled) bookings of one staff member overlapping [start, end), optionally ignoring one booking.
 * `staffId` null checks the bookings made before staff existed, which share one calendar.
 */
export function findOverlap(staffId: number | null, start: Date, end: Date, ignoreId?: number) {
  return db
    .select({ id: booking.id, reference: booking.reference })
    .from(booking)
    .where(
      and(
        staffId === null ? isNull(booking.staffId) : eq(booking.staffId, staffId),
        ne(booking.status, "cancelled"),
        lt(booking.startsAt, end),
        gt(booking.endsAt, start),
        ignoreId ? ne(booking.id, ignoreId) : undefined,
      ),
    )
    .get();
}

/**
 * Online bookings hold their slot as "pending" while the customer pays. Once the hold runs out unpaid,
 * cancel it so the slot is free again. Called before anything reads or claims slots, so no cron is needed.
 */
export function releaseExpiredHolds(now = new Date()) {
  db.update(booking)
    .set({ status: "cancelled" })
    .where(and(eq(booking.status, "pending"), eq(booking.paymentStatus, "unpaid"), lt(booking.holdExpiresAt, now)))
    .run();
}

/** Active staff who provide a service. */
export function staffForService(serviceId: number) {
  return db
    .select({ id: staff.id })
    .from(staff)
    .innerJoin(staffService, eq(staffService.staffId, staff.id))
    .where(and(eq(staffService.serviceId, serviceId), eq(staff.active, true)))
    .all()
    .map((r) => r.id);
}

export function staffProvides(staffId: number, serviceId: number) {
  return Boolean(
    db.select().from(staffService).where(and(eq(staffService.staffId, staffId), eq(staffService.serviceId, serviceId))).get(),
  );
}

/** A staff member's working blocks on a business date, as epoch ms. Empty on business closures and their days off. */
function workingBlocks(staffId: number, dateKey: string) {
  if (db.select().from(blockedDate).where(eq(blockedDate.date, dateKey)).get()) return [];
  if (db.select().from(staffTimeOff).where(and(eq(staffTimeOff.staffId, staffId), eq(staffTimeOff.date, dateKey))).get()) return [];
  return db
    .select()
    .from(staffHours)
    .where(and(eq(staffHours.staffId, staffId), eq(staffHours.weekday, weekdayOfKey(dateKey))))
    .all()
    .map((r) => ({
      start: fromBusinessTime(`${dateKey}T${r.startTime}`).getTime(),
      end: fromBusinessTime(`${dateKey}T${r.endTime}`).getTime(),
    }));
}

/** Whether [start, end) sits inside one of the staff member's working blocks that day. */
export function isWorking(staffId: number, start: Date, end: Date) {
  return workingBlocks(staffId, toDateKey(start)).some((b) => b.start <= start.getTime() && end.getTime() <= b.end);
}

/**
 * Free start times for a service on a business-time date ("YYYY-MM-DD"), each with the staff free then.
 * Each staff member's slots step by the service duration from the start of their working blocks.
 * Pass `onlyStaffId` to look at one staff member's calendar.
 */
export function getSlotStaff(
  dateKey: string,
  serviceId: number,
  { now = new Date(), onlyStaffId }: { now?: Date; onlyStaffId?: number } = {},
) {
  releaseExpiredHolds(now);
  const slots = new Map<number, number[]>();
  const svc = db.select().from(service).where(eq(service.id, serviceId)).get();
  if (!svc || !svc.active) return slots;

  const staffIds = staffForService(serviceId).filter((id) => !onlyStaffId || id === onlyStaffId);
  const dayStart = startOfBusinessDay(dateKey);
  const dayEnd = startOfBusinessDay(addDaysToKey(dateKey, 1));
  const durationMs = svc.durationMins * 60_000;

  for (const staffId of staffIds) {
    const blocks = workingBlocks(staffId, dateKey);
    if (blocks.length === 0) continue;
    const taken = db
      .select({ startsAt: booking.startsAt, endsAt: booking.endsAt })
      .from(booking)
      .where(and(eq(booking.staffId, staffId), ne(booking.status, "cancelled"), lt(booking.startsAt, dayEnd), gt(booking.endsAt, dayStart)))
      .all();

    for (const block of blocks) {
      for (let t = block.start; t + durationMs <= block.end; t += durationMs) {
        const end = t + durationMs;
        if (t <= now.getTime()) continue;
        if (taken.some((b) => b.startsAt.getTime() < end && b.endsAt.getTime() > t)) continue;
        slots.set(t, [...(slots.get(t) ?? []), staffId]);
      }
    }
  }
  return slots;
}

/** Free start times for a service on a business-time date: any qualified staff member, or just `onlyStaffId`. */
export function getAvailableSlots(dateKey: string, serviceId: number, now = new Date(), onlyStaffId?: number) {
  return [...getSlotStaff(dateKey, serviceId, { now, onlyStaffId }).keys()].sort((a, b) => a - b).map((t) => new Date(t));
}

/**
 * Who should take a new booking for [start, end): a staff member who provides the service, is working then
 * and is free. The one with the fewest active bookings that day wins, so work spreads evenly.
 */
export function pickStaff(serviceId: number, start: Date, end: Date) {
  const dayStart = startOfBusinessDay(toDateKey(start));
  const dayEnd = startOfBusinessDay(addDaysToKey(toDateKey(start), 1));
  const free = staffForService(serviceId).filter((id) => isWorking(id, start, end) && !findOverlap(id, start, end));
  if (free.length === 0) return null;

  const load = (staffId: number) =>
    db
      .select({ n: count() })
      .from(booking)
      .where(and(eq(booking.staffId, staffId), ne(booking.status, "cancelled"), gte(booking.startsAt, dayStart), lt(booking.startsAt, dayEnd)))
      .get()?.n ?? 0;
  return free.map((id) => ({ id, n: load(id) })).sort((a, b) => a.n - b.n || a.id - b.id)[0].id;
}

/** Display name of a staff member, for audit summaries and emails. */
export function staffName(staffId: number | null) {
  if (!staffId) return "Unassigned";
  return (
    db.select({ name: user.name }).from(staff).innerJoin(user, eq(user.id, staff.userId)).where(eq(staff.id, staffId)).get()?.name ??
    "Unknown staff"
  );
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
  /** Leave out to auto-assign a free staff member who provides the service. */
  staffId?: number | null;
  mode?: BookingMode;
  status?: "pending" | "confirmed";
  clientNotes?: string | null;
  adminNotes?: string | null;
  meetingUrl?: string | null;
  holdExpiresAt?: Date | null;
  actor: Actor;
};

/** Create a booking, refusing if it overlaps the staff member's calendar. Runs in a single write transaction. */
export function createBooking(input: CreateBookingInput) {
  releaseExpiredHolds();
  return db.transaction((tx) => {
    const svc = tx.select().from(service).where(eq(service.id, input.serviceId)).get();
    if (!svc) throw new BookingError("Service not found.");

    const endsAt = new Date(input.startsAt.getTime() + svc.durationMins * 60_000);
    let staffId = input.staffId ?? null;
    if (staffId) {
      if (!staffProvides(staffId, svc.id)) throw new BookingError(`${staffName(staffId)} doesn't provide ${svc.name}.`);
      const clash = findOverlap(staffId, input.startsAt, endsAt);
      if (clash) throw new BookingError(`That time overlaps ${staffName(staffId)}'s booking ${clash.reference}.`);
    } else {
      staffId = pickStaff(svc.id, input.startsAt, endsAt);
      if (!staffId) throw new BookingError("No staff member who provides this service is free at that time.");
    }

    const created = tx
      .insert(booking)
      .values({
        reference: newReference(),
        clientId: input.clientId,
        serviceId: svc.id,
        staffId,
        startsAt: input.startsAt,
        endsAt,
        status: input.status ?? "pending",
        mode: input.mode ?? "in_person",
        priceCents: svc.priceCents,
        clientNotes: input.clientNotes || null,
        adminNotes: input.adminNotes || null,
        meetingUrl: input.meetingUrl || null,
        holdExpiresAt: input.holdExpiresAt ?? null,
      })
      .returning()
      .get();

    logAudit({
      actor: input.actor,
      action: "created",
      bookingId: created.id,
      staffId,
      summary: `${created.reference}: ${svc.name} on ${formatDateTime(created.startsAt)} with ${staffName(staffId)}${input.staffId ? "" : " (auto-assigned)"}.`,
      details: { status: created.status, startsAt: created.startsAt.toISOString(), staffId, serviceId: svc.id },
    });
    return created;
  });
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};

/** Changes a booking's status and records who did it. Refuses to re-activate a booking whose slot is now taken. */
export function setBookingStatus(id: number, status: BookingStatus, actor: Actor) {
  return db.transaction(() => {
    const current = db.select().from(booking).where(eq(booking.id, id)).get();
    if (!current) return { error: "Booking not found." };
    if (current.status === status) return { booking: current };

    if (current.status === "cancelled") {
      const clash = findOverlap(current.staffId, current.startsAt, current.endsAt, id);
      if (clash) return { error: `Can't re-activate: the slot is now taken by ${clash.reference}.` };
    }
    db.update(booking).set({ status }).where(eq(booking.id, id)).run();
    logAudit({
      actor,
      action: "status_changed",
      bookingId: id,
      staffId: current.staffId,
      summary: `${current.reference}: ${STATUS_LABEL[current.status]} → ${STATUS_LABEL[status]}.`,
      details: { from: current.status, to: status },
    });
    return { booking: current };
  });
}

/**
 * Moves a booking to a new time, and optionally a new service or staff member. Checks the (new) staff member's
 * calendar for clashes; working hours are not enforced, so admins and staff can fit someone in after hours.
 */
export function rescheduleBooking(input: { id: number; startsAt: Date; serviceId?: number; staffId?: number | null; actor: Actor }) {
  return db.transaction(() => {
    const current = db.select().from(booking).where(eq(booking.id, input.id)).get();
    if (!current) return { error: "Booking not found." };
    const svc = db.select().from(service).where(eq(service.id, input.serviceId ?? current.serviceId)).get();
    if (!svc) return { error: "Service not found." };

    const staffId = input.staffId === undefined ? current.staffId : input.staffId;
    if (staffId && (staffId !== current.staffId || svc.id !== current.serviceId) && !staffProvides(staffId, svc.id)) {
      return { error: `${staffName(staffId)} doesn't provide ${svc.name}.` };
    }
    const startsAt = input.startsAt;
    const endsAt = new Date(startsAt.getTime() + svc.durationMins * 60_000);
    const clash = findOverlap(staffId, startsAt, endsAt, current.id);
    if (clash) return { error: `That time overlaps ${staffName(staffId)}'s booking ${clash.reference}.` };

    const moved = startsAt.getTime() !== current.startsAt.getTime() || svc.id !== current.serviceId;
    const reassigned = staffId !== current.staffId;
    if (!moved && !reassigned) return { error: "Nothing changed: that's the booking's current time and staff." };

    db.update(booking)
      .set({ startsAt, endsAt, serviceId: svc.id, staffId, ...(moved ? { reminderSentAt: null } : {}) })
      .where(eq(booking.id, current.id))
      .run();

    const parts = [
      startsAt.getTime() !== current.startsAt.getTime() && `moved from ${formatDateTime(current.startsAt)} to ${formatDateTime(startsAt)}`,
      svc.id !== current.serviceId && `service changed to ${svc.name}`,
      reassigned && `reassigned from ${staffName(current.staffId)} to ${staffName(staffId)}`,
    ].filter(Boolean);
    logAudit({
      actor: input.actor,
      action: moved ? "rescheduled" : "reassigned",
      bookingId: current.id,
      staffId,
      summary: `${current.reference}: ${parts.join("; ")}.`,
      details: {
        from: { startsAt: current.startsAt.toISOString(), serviceId: current.serviceId, staffId: current.staffId },
        to: { startsAt: startsAt.toISOString(), serviceId: svc.id, staffId },
      },
    });
    return { booking: current, moved, reassigned };
  });
}

/**
 * The client record for a signed-in (email-verified) user. Links an existing guest record with the
 * same email — safe because the email is verified — or creates one.
 */
export function clientForUser(u: { id: string; name: string; email: string }) {
  const linked = db.select().from(client).where(eq(client.userId, u.id)).get();
  if (linked) return linked;

  const email = u.email.toLowerCase();
  const byEmail = db.select().from(client).where(eq(client.email, email)).get();
  if (byEmail && !byEmail.userId) {
    return db.update(client).set({ userId: u.id }).where(eq(client.id, byEmail.id)).returning().get();
  }
  return db.insert(client).values({ userId: u.id, name: u.name, email }).returning().get();
}

/**
 * Creates a Zoom meeting for an online booking and stores its link.
 * Never throws: if Zoom is down or not configured the booking stands and the admin can add a link by hand.
 */
export async function attachZoomMeeting(bookingId: number) {
  if (!isZoomConfigured()) {
    console.warn(`Zoom not configured; booking ${bookingId} has no meeting link.`);
    return null;
  }
  const row = db
    .select({ b: booking, serviceName: service.name, clientName: client.name })
    .from(booking)
    .innerJoin(service, eq(service.id, booking.serviceId))
    .innerJoin(client, eq(client.id, booking.clientId))
    .where(eq(booking.id, bookingId))
    .get();
  if (!row || row.b.zoomMeetingId) return row?.b.meetingUrl ?? null;

  try {
    const { meetingId, joinUrl } = await createZoomMeeting({
      topic: `${row.serviceName} · ${row.clientName} (${row.b.reference})`,
      startsAt: row.b.startsAt,
      durationMins: Math.round((row.b.endsAt.getTime() - row.b.startsAt.getTime()) / 60_000),
      agenda: `APCAMS Consultancy session, booking ${row.b.reference}`,
    });
    db.update(booking).set({ zoomMeetingId: meetingId, meetingUrl: joinUrl }).where(eq(booking.id, bookingId)).run();
    return joinUrl;
  } catch (e) {
    console.error(`Could not create Zoom meeting for booking ${bookingId}:`, e);
    return null;
  }
}

/** Keeps the Zoom meeting in step after a reschedule or cancellation. Logs instead of throwing. */
export async function syncZoomMeeting(bookingId: number) {
  const b = db.select().from(booking).where(eq(booking.id, bookingId)).get();
  if (!b?.zoomMeetingId || !isZoomConfigured()) return;
  try {
    if (b.status === "cancelled") {
      await deleteZoomMeeting(b.zoomMeetingId);
      db.update(booking).set({ zoomMeetingId: null, meetingUrl: null }).where(eq(booking.id, bookingId)).run();
    } else {
      await rescheduleZoomMeeting(b.zoomMeetingId, b.startsAt, Math.round((b.endsAt.getTime() - b.startsAt.getTime()) / 60_000));
    }
  } catch (e) {
    console.error(`Could not update Zoom meeting for booking ${bookingId}:`, e);
  }
}

/** Cancelling deletes the Zoom meeting; an active online booking with no link gets one. */
export async function afterStatusChange(id: number) {
  const b = db.select().from(booking).where(eq(booking.id, id)).get();
  if (!b) return;
  if (b.status === "cancelled") await syncZoomMeeting(id);
  else if ((b.status === "pending" || b.status === "confirmed") && b.mode === "online" && !b.meetingUrl && b.startsAt > new Date()) {
    await attachZoomMeeting(id);
  }
}
