"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { booking } from "@/db/schema";
import { requireStaff } from "@/lib/admin";
import { actorFrom } from "@/lib/audit";
import { afterStatusChange, rescheduleBooking, setBookingStatus, syncZoomMeeting } from "@/lib/bookings";
import { fromBusinessTime } from "@/lib/format";
import type { ActionResult } from "@/app/dashboard/(panel)/_components/ActionForm";

/** The signed-in staff member and one of their own bookings (never someone else's). */
async function myBooking(id: number) {
  const me = await requireStaff();
  const b = db.select().from(booking).where(and(eq(booking.id, id), eq(booking.staffId, me.staff.id))).get();
  return { me, b };
}

function refresh() {
  revalidatePath("/staff", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/account");
}

/** Staff can close out an active booking: completed, no-show, or cancelled. */
const STAFF_STATUSES = ["completed", "no_show", "cancelled"] as const;

export async function staffSetStatusAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = z.object({ id: z.coerce.number().int().positive(), status: z.enum(STAFF_STATUSES) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Choose a valid action." };
  const { me, b } = await myBooking(parsed.data.id);
  if (!b) return { error: "Booking not found." };
  if (b.status !== "pending" && b.status !== "confirmed") return { error: "Only active bookings can be changed." };
  if (parsed.data.status !== "cancelled" && b.startsAt > new Date()) return { error: "You can mark a session completed or no-show once it has started." };

  const result = setBookingStatus(b.id, parsed.data.status, actorFrom(me.user));
  if ("error" in result) return { error: result.error };
  await afterStatusChange(b.id);
  refresh();
  return { success: parsed.data.status === "cancelled" ? "Booking cancelled. The admin can see this in the audit log." : "Booking updated." };
}

export async function staffRescheduleAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = z
    .object({ id: z.coerce.number().int().positive(), startsAt: z.string().min(1, "Choose a date and time.") })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { me, b } = await myBooking(parsed.data.id);
  if (!b) return { error: "Booking not found." };
  if (b.status !== "pending" && b.status !== "confirmed") return { error: "Only active bookings can be rescheduled." };

  const startsAt = fromBusinessTime(parsed.data.startsAt);
  if (startsAt <= new Date()) return { error: "Choose a time in the future." };
  const result = rescheduleBooking({ id: b.id, startsAt, actor: actorFrom(me.user) });
  if ("error" in result) return { error: result.error };
  await syncZoomMeeting(b.id);
  refresh();
  return { success: "Booking rescheduled. Let the client know the new time." };
}
