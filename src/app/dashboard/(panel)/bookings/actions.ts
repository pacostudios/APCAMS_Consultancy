"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { BOOKING_MODES, BOOKING_STATUSES, PAYMENT_STATUSES, booking } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { actorFrom, logAudit } from "@/lib/audit";
import { refundBooking } from "@/lib/payments";
import {
  BookingError,
  afterStatusChange,
  attachZoomMeeting,
  createBooking,
  findOverlap,
  rescheduleBooking,
  setBookingStatus,
  syncZoomMeeting,
  upsertClient,
} from "@/lib/bookings";
import { fromBusinessTime } from "@/lib/format";
import { notifyStaff } from "@/lib/staff";
import type { ActionResult } from "../_components/ActionForm";

const optional = z.string().trim().optional().transform((v) => v || null);

const newBookingSchema = z.object({
  clientId: z.coerce.number().int().positive().optional().catch(undefined),
  name: optional,
  email: z.union([z.literal(""), z.email("Enter a valid email.")]).optional().transform((v) => v || null),
  phone: optional,
  serviceId: z.coerce.number().int().positive("Choose a service."),
  // Empty means auto-assign.
  staffId: z.coerce.number().int().positive().optional().catch(undefined),
  startsAt: z.string().min(1, "Choose a date and time."),
  mode: z.enum(BOOKING_MODES),
  status: z.enum(["pending", "confirmed"]),
  meetingUrl: optional,
  adminNotes: optional,
});

function refresh() {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/staff", "layout");
}

export async function createBookingAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
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
      staffId: d.staffId,
      startsAt: fromBusinessTime(d.startsAt),
      mode: d.mode,
      status: d.status,
      meetingUrl: d.meetingUrl,
      adminNotes: d.adminNotes,
      actor: actorFrom(admin),
    }).id;
  } catch (e) {
    if (e instanceof BookingError) return { error: e.message };
    throw e;
  }

  // Online sessions without a hand-entered link get a Zoom meeting.
  if (d.mode === "online" && !d.meetingUrl) await attachZoomMeeting(id);
  await notifyStaff(id, "assigned");

  refresh();
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

const UPDATE_LABELS = {
  status: "status",
  paymentStatus: "payment status",
  mode: "format",
  meetingUrl: "meeting link",
  adminNotes: "internal notes",
} as const;

export async function updateBookingAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...values } = parsed.data;

  const current = db.select().from(booking).where(eq(booking.id, id)).get();
  if (!current) return { error: "Booking not found." };

  // Re-activating a cancelled booking must not double-book the slot.
  if (current.status === "cancelled" && values.status !== "cancelled") {
    const clash = findOverlap(current.staffId, current.startsAt, current.endsAt, id);
    if (clash) return { error: `Can't re-activate: the slot is now taken by ${clash.reference}.` };
  }

  const changed = (Object.keys(values) as (keyof typeof values)[]).filter((k) => values[k] !== current[k]);
  if (changed.length === 0) return { success: "Nothing to save." };

  db.update(booking).set(values).where(eq(booking.id, id)).run();
  logAudit({
    actor: actorFrom(admin),
    action: changed.includes("status") ? "status_changed" : "updated",
    bookingId: id,
    staffId: current.staffId,
    summary:
      `${current.reference}: changed ${changed.map((k) => UPDATE_LABELS[k]).join(", ")}` +
      (changed.includes("status") ? ` (${current.status} → ${values.status}).` : "."),
    details: Object.fromEntries(changed.map((k) => [k, { from: current[k], to: values[k] }])),
  });

  await afterStatusChange(id);
  if (changed.includes("status") && values.status === "cancelled") await notifyStaff(id, "cancelled");
  refresh();
  return { success: "Booking updated." };
}

const rescheduleSchema = z.object({
  id: z.coerce.number().int().positive(),
  serviceId: z.coerce.number().int().positive(),
  staffId: z.coerce.number().int().positive("Choose a staff member."),
  startsAt: z.string().min(1, "Choose a date and time."),
});

/** Moves a booking to a new time, service and/or staff member. Both staff members are emailed on a reassignment. */
export async function rescheduleBookingAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = rescheduleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, serviceId, staffId, startsAt } = parsed.data;

  const result = rescheduleBooking({ id, serviceId, staffId, startsAt: fromBusinessTime(startsAt), actor: actorFrom(admin) });
  if ("error" in result) return { error: result.error };

  await syncZoomMeeting(id);
  if (result.reassigned) {
    await notifyStaff(id, "unassigned", result.booking.staffId);
    await notifyStaff(id, "assigned");
  } else {
    await notifyStaff(id, "rescheduled");
  }
  refresh();
  return { success: result.reassigned ? "Booking updated and both staff members were emailed." : "Booking rescheduled." };
}

/** One-click status change from the booking page (confirm, complete, cancel…). */
export async function setBookingStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get("id"));
  const status = z.enum(BOOKING_STATUSES).parse(formData.get("status"));
  const result = setBookingStatus(id, status, actorFrom(admin));
  if ("error" in result) return;
  await afterStatusChange(id);
  if (status === "cancelled" && result.booking.status !== "cancelled") await notifyStaff(id, "cancelled");
  refresh();
}

/** Full Stripe refund of a paid booking. Doesn't change the booking status; cancel separately if needed. */
export async function refundBookingAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const id = Number(formData.get("id"));
  try {
    await refundBooking(id);
  } catch (e) {
    console.error("[payments] Admin refund failed:", e);
    return { error: e instanceof Error ? e.message : "Refund failed." };
  }
  const b = db.select().from(booking).where(eq(booking.id, id)).get();
  if (b) {
    logAudit({
      actor: actorFrom(admin),
      action: "refunded",
      bookingId: id,
      staffId: b.staffId,
      summary: `${b.reference}: refunded the full payment.`,
      details: { amountCents: b.amountPaidCents ?? b.priceCents },
    });
  }
  refresh();
  revalidatePath("/account");
  return { success: "Refunded in full. It can take 5–10 business days to reach the client." };
}

/** Creates a Zoom meeting for an online booking that doesn't have a link yet. */
export async function createZoomMeetingAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await attachZoomMeeting(id);
  refresh();
  revalidatePath("/account");
}
