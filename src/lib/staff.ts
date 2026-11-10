import "server-only";
import { randomUUID } from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { db } from "@/db";
import { account, availability, booking, client, service, session, staff, staffHours, staffService, user } from "@/db/schema";
import { logAudit, type Actor } from "./audit";
import { sendEmail, simpleEmail } from "./email";
import { formatTime, formatWeekdayDate, zoneLabel } from "./format";

export class StaffError extends Error {}

/** Every staff member with their user details and the ids of the services they provide. */
export function listStaff({ activeOnly = false } = {}) {
  const rows = db
    .select({ id: staff.id, userId: staff.userId, title: staff.title, phone: staff.phone, active: staff.active, name: user.name, email: user.email })
    .from(staff)
    .innerJoin(user, eq(user.id, staff.userId))
    .where(activeOnly ? eq(staff.active, true) : undefined)
    .orderBy(asc(user.name))
    .all();
  const links = db.select().from(staffService).all();
  return rows.map((r) => ({ ...r, serviceIds: links.filter((l) => l.staffId === r.id).map((l) => l.serviceId) }));
}

export type StaffRow = ReturnType<typeof listStaff>[number];

export function getStaff(id: number) {
  return listStaff().find((s) => s.id === id) ?? null;
}

/**
 * Creates a staff member's sign-in (email + password chosen by the admin) and profile.
 * Their weekly hours start as a copy of the default business hours.
 */
export async function createStaffAccount(input: {
  name: string;
  email: string;
  password: string;
  title: string | null;
  phone: string | null;
  serviceIds: number[];
  actor: Actor;
}) {
  const email = input.email.trim().toLowerCase();
  if (db.select().from(user).where(eq(user.email, email)).get()) throw new StaffError("That email already has an account.");
  const hash = await hashPassword(input.password);

  return db.transaction((tx) => {
    const userId = randomUUID();
    // The admin vouches for the email, so staff can sign in straight away without a confirmation link.
    tx.insert(user).values({ id: userId, name: input.name, email, emailVerified: true, role: "staff" }).run();
    tx.insert(account).values({ id: randomUUID(), accountId: userId, providerId: "credential", userId, password: hash }).run();
    const created = tx.insert(staff).values({ userId, title: input.title, phone: input.phone }).returning().get();

    if (input.serviceIds.length) {
      tx.insert(staffService).values(input.serviceIds.map((serviceId) => ({ staffId: created.id, serviceId }))).run();
    }
    const defaults = tx.select().from(availability).all();
    if (defaults.length) {
      tx.insert(staffHours)
        .values(defaults.map((d) => ({ staffId: created.id, weekday: d.weekday, startTime: d.startTime, endTime: d.endTime })))
        .run();
    }
    logAudit({
      actor: input.actor,
      action: "staff_created",
      staffId: created.id,
      summary: `Added staff member ${input.name} (${email}).`,
      details: { serviceIds: input.serviceIds },
    });
    return created;
  });
}

/** Sets a new password chosen by the admin and signs the staff member out everywhere. */
export async function setStaffPassword(staffId: number, password: string, actor: Actor) {
  const s = getStaff(staffId);
  if (!s) throw new StaffError("Staff member not found.");
  const hash = await hashPassword(password);
  db.transaction((tx) => {
    tx.update(account)
      .set({ password: hash })
      .where(and(eq(account.userId, s.userId), eq(account.providerId, "credential")))
      .run();
    tx.delete(session).where(eq(session.userId, s.userId)).run();
    logAudit({ actor, action: "staff_updated", staffId, summary: `Set a new password for ${s.name}.` });
  });
}

/** Signs a staff member out of every device, e.g. when they are deactivated. */
export function revokeStaffSessions(userId: string) {
  db.delete(session).where(eq(session.userId, userId)).run();
}

type NoticeKind = "assigned" | "rescheduled" | "cancelled" | "unassigned";

const NOTICE: Record<NoticeKind, { subject: string; heading: string; lead: string }> = {
  assigned: { subject: "New booking", heading: "You have a new booking", lead: "A session has been booked with you" },
  rescheduled: { subject: "Booking rescheduled", heading: "A booking was rescheduled", lead: "One of your sessions has moved" },
  cancelled: { subject: "Booking cancelled", heading: "A booking was cancelled", lead: "This session has been cancelled" },
  unassigned: { subject: "Booking reassigned", heading: "A booking was moved to someone else", lead: "This session is no longer with you" },
};

/**
 * Emails a staff member about one of their bookings. `staffId` overrides the booking's own staff,
 * so the previous person can be told when a booking is reassigned. Never throws.
 */
export async function notifyStaff(bookingId: number, kind: NoticeKind, staffId?: number | null) {
  try {
    const row = db
      .select({ b: booking, serviceName: service.name, clientName: client.name })
      .from(booking)
      .innerJoin(service, eq(service.id, booking.serviceId))
      .innerJoin(client, eq(client.id, booking.clientId))
      .where(eq(booking.id, bookingId))
      .get();
    const to = staffId ?? row?.b.staffId;
    if (!row || !to) return;
    const member = db
      .select({ email: user.email, name: user.name })
      .from(staff)
      .innerJoin(user, eq(user.id, staff.userId))
      .where(and(eq(staff.id, to), eq(staff.active, true)))
      .get();
    if (!member) return;

    const { b } = row;
    const n = NOTICE[kind];
    const when = `${formatWeekdayDate(b.startsAt)} at ${formatTime(b.startsAt)} ${zoneLabel(b.startsAt)}`;
    const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
    const { html, text } = simpleEmail({
      heading: n.heading,
      body: `${n.lead}: ${row.serviceName} with ${row.clientName} on ${when} (${b.mode === "online" ? "online" : "in person"}, ref ${b.reference}).`,
      cta: "Open in staff portal",
      url: `${base}/staff/bookings/${b.id}`,
    });
    await sendEmail({ to: member.email, subject: `${n.subject}: ${row.serviceName}, ${formatWeekdayDate(b.startsAt)}`, html, text });
  } catch (e) {
    console.error(`[staff] Could not email staff about booking ${bookingId}:`, e);
  }
}
