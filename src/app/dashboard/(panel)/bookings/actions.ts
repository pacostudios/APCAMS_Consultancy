"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { BOOKING_MODES, BOOKING_STATUSES, PAYMENT_STATUSES, booking, service } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { BookingError, createBooking, findOverlap, upsertClient } from "@/lib/bookings";
import { fromBusinessTime } from "@/lib/format";
import type { ActionResult } from "../_components/ActionForm";

const optional = z.string().trim().optional().transform((v) => v || null);

const newBookingSchema = z.object({
  clientId: z.coerce.number().int().positive().optional().catch(undefined),
  name: optional,
  email: z.union([z.literal(""), z.email("Enter a valid email.")]).optional().transform((v) => v || null),
  phone: optional,
  serviceId: z.coerce.number().int().positive("Choose a service."),
  startsAt: z.string().min(1, "Choose a date and time."),
  mode: z.enum(BOOKING_MODES),
  status: z.enum(["pending", "confirmed"]),
  meetingUrl: optional,
  adminNotes: optional,
});

export async function createBookingAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = newBookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  let clientId = d.clientId;
  if (!clientId) {
    if (!d.name) return { error: "Choose an existing client or enter the new client's name." };
    if (!d.email && !d.phone) return { error: "Enter an email or phone number for the new client." };
    clientId = upsertClient({ name: d.name, email: d.email, phone: d.phone }).id;
  }

  let id: number;
  try {
    id = createBooking({
      clientId,
      serviceId: d.serviceId,
      startsAt: fromBusinessTime(d.startsAt),
      mode: d.mode,
      status: d.status,
      meetingUrl: d.meetingUrl,
      adminNotes: d.adminNotes,
    }).id;
  } catch (e) {
    if (e instanceof BookingError) return { error: e.message };
    throw e;
  }

  revalidatePath("/dashboard", "layout");
  redirect(`/dashboard/bookings/${id}`);
}

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(BOOKING_STATUSES),
  paymentStatus: z.enum(PAYMENT_STATUSES),
  mode: z.enum(BOOKING_MODES),
  meetingUrl: z.union([z.literal(""), z.url("Meeting link must be a full URL.")]).transform((v) => v || null),
  adminNotes: optional,
});

export async function updateBookingAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...values } = parsed.data;

  const current = db.select().from(booking).where(eq(booking.id, id)).get();
  if (!current) return { error: "Booking not found." };

  // Re-activating a cancelled booking must not double-book the slot.
  if (current.status === "cancelled" && values.status !== "cancelled") {
    const clash = findOverlap(current.startsAt, current.endsAt, id);
    if (clash) return { error: `Can't re-activate: the slot is now taken by ${clash.reference}.` };
  }

  db.update(booking).set(values).where(eq(booking.id, id)).run();
  revalidatePath("/dashboard", "layout");
  return { success: "Booking updated." };
}

const rescheduleSchema = z.object({
  id: z.coerce.number().int().positive(),
  serviceId: z.coerce.number().int().positive(),
  startsAt: z.string().min(1, "Choose a date and time."),
});

export async function rescheduleBookingAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = rescheduleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, serviceId, startsAt: local } = parsed.data;

  const svc = db.select().from(service).where(eq(service.id, serviceId)).get();
  if (!svc) return { error: "Service not found." };

  const startsAt = fromBusinessTime(local);
  const endsAt = new Date(startsAt.getTime() + svc.durationMins * 60_000);

  const result = db.transaction(() => {
    const clash = findOverlap(startsAt, endsAt, id);
    if (clash) return { error: `That time overlaps booking ${clash.reference}.` };
    db.update(booking).set({ startsAt, endsAt, serviceId, reminderSentAt: null }).where(eq(booking.id, id)).run();
    return { success: "Booking rescheduled." };
  });

  revalidatePath("/dashboard", "layout");
  return result;
}

/** One-click status change from the booking page (confirm, complete, cancel…). */
export async function setBookingStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = z.enum(BOOKING_STATUSES).parse(formData.get("status"));
  const current = db.select().from(booking).where(eq(booking.id, id)).get();
  if (!current) return;
  if (current.status === "cancelled" && status !== "cancelled" && findOverlap(current.startsAt, current.endsAt, id)) return;
  db.update(booking).set({ status }).where(eq(booking.id, id)).run();
  revalidatePath("/dashboard", "layout");
}
