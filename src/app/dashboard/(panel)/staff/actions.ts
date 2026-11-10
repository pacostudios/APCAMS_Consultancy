"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { service, staff, staffHours, staffService, staffTimeOff, user } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { actorFrom, logAudit } from "@/lib/audit";
import { parseHoursForm } from "@/lib/hours";
import { StaffError, createStaffAccount, getStaff, revokeStaffSessions, setStaffPassword } from "@/lib/staff";
import type { ActionResult } from "../_components/ActionForm";

const optional = z.string().trim().optional().transform((v) => v || null);
const password = z.string().min(8, "The password must be at least 8 characters.").max(128);

const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter the staff member's name.").max(100),
  email: z.email("Enter a valid email.").transform((v) => v.trim().toLowerCase()),
  title: optional,
  phone: optional,
});

/** Checked service boxes, keeping only ids that exist. */
function serviceIdsFrom(formData: FormData) {
  const ids = formData.getAll("serviceIds").map(Number).filter((n) => Number.isInteger(n) && n > 0);
  if (ids.length === 0) return [];
  const known = new Set(db.select({ id: service.id }).from(service).all().map((s) => s.id));
  return [...new Set(ids)].filter((id) => known.has(id));
}

function refresh(staffId?: number) {
  revalidatePath("/dashboard/staff");
  if (staffId) revalidatePath(`/dashboard/staff/${staffId}`);
  revalidatePath("/staff", "layout");
}

export async function createStaffAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = profileSchema.extend({ password }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let id: number;
  try {
    id = (await createStaffAccount({ ...parsed.data, serviceIds: serviceIdsFrom(formData), actor: actorFrom(admin) })).id;
  } catch (e) {
    if (e instanceof StaffError) return { error: e.message };
    throw e;
  }
  refresh();
  redirect(`/dashboard/staff/${id}?created=1`);
}

export async function updateStaffAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const id = Number(formData.get("id"));
  const current = getStaff(id);
  if (!current) return { error: "Staff member not found." };
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  const active = formData.get("active") === "on";
  const serviceIds = serviceIdsFrom(formData);

  if (d.email !== current.email && db.select().from(user).where(and(eq(user.email, d.email), ne(user.id, current.userId))).get()) {
    return { error: "That email already has an account." };
  }

  const changes = [
    d.name !== current.name && "name",
    d.email !== current.email && "email",
    d.title !== current.title && "title",
    d.phone !== current.phone && "phone",
    active !== current.active && (active ? "reactivated" : "deactivated"),
    [...serviceIds].sort().join() !== [...current.serviceIds].sort().join() && "services",
  ].filter((c): c is string => Boolean(c));
  if (changes.length === 0) return { success: "Nothing to save." };

  db.transaction((tx) => {
    tx.update(user).set({ name: d.name, email: d.email }).where(eq(user.id, current.userId)).run();
    tx.update(staff).set({ title: d.title, phone: d.phone, active }).where(eq(staff.id, id)).run();
    tx.delete(staffService).where(eq(staffService.staffId, id)).run();
    if (serviceIds.length) tx.insert(staffService).values(serviceIds.map((serviceId) => ({ staffId: id, serviceId }))).run();
    logAudit({
      actor: actorFrom(admin),
      action: "staff_updated",
      staffId: id,
      summary: `Updated ${d.name}: ${changes.join(", ")}.`,
      details: { before: { ...current }, after: { ...d, active, serviceIds } },
    });
  });
  if (!active && current.active) revokeStaffSessions(current.userId);
  refresh(id);
  return { success: active || !current.active ? "Saved." : "Saved. They've been signed out and get no new bookings; reassign their upcoming ones." };
}

export async function resetStaffPasswordAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = z.object({ id: z.coerce.number().int().positive(), password }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await setStaffPassword(parsed.data.id, parsed.data.password, actorFrom(admin));
  } catch (e) {
    if (e instanceof StaffError) return { error: e.message };
    throw e;
  }
  refresh(parsed.data.id);
  return { success: "Password changed. Share it with them; they've been signed out of other devices." };
}

export async function saveStaffHoursAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const id = Number(formData.get("staffId"));
  const member = getStaff(id);
  if (!member) return { error: "Staff member not found." };
  const parsed = parseHoursForm(formData);
  if ("error" in parsed) return parsed;
  const { rows } = parsed;

  db.transaction((tx) => {
    tx.delete(staffHours).where(eq(staffHours.staffId, id)).run();
    if (rows.length) tx.insert(staffHours).values(rows.map((r) => ({ ...r, staffId: id }))).run();
    logAudit({ actor: actorFrom(admin), action: "staff_updated", staffId: id, summary: `Updated ${member.name}'s weekly hours.`, details: { hours: rows } });
  });
  refresh(id);
  return { success: "Weekly hours saved. Existing bookings are not moved." };
}

const timeOffSchema = z.object({
  staffId: z.coerce.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  reason: optional,
});

export async function addStaffTimeOffAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = timeOffSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const member = getStaff(parsed.data.staffId);
  if (!member) return { error: "Staff member not found." };

  db.insert(staffTimeOff)
    .values(parsed.data)
    .onConflictDoUpdate({ target: [staffTimeOff.staffId, staffTimeOff.date], set: { reason: parsed.data.reason } })
    .run();
  logAudit({
    actor: actorFrom(admin),
    action: "staff_updated",
    staffId: member.id,
    summary: `Marked ${member.name} away on ${parsed.data.date}${parsed.data.reason ? ` (${parsed.data.reason})` : ""}.`,
  });
  refresh(member.id);
  return { success: "Day off added. Existing bookings that day are not cancelled automatically." };
}

export async function removeStaffTimeOffAction(formData: FormData) {
  const admin = await requireAdmin();
  const row = db.select().from(staffTimeOff).where(eq(staffTimeOff.id, Number(formData.get("id")))).get();
  if (!row) return;
  db.delete(staffTimeOff).where(eq(staffTimeOff.id, row.id)).run();
  logAudit({ actor: actorFrom(admin), action: "staff_updated", staffId: row.staffId, summary: `Removed ${getStaff(row.staffId)?.name ?? "staff"}'s day off on ${row.date}.` });
  refresh(row.staffId);
}
