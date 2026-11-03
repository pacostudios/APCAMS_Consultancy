"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { availability, blockedDate } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { parseHoursForm } from "@/lib/hours";
import type { ActionResult } from "../_components/ActionForm";

export async function saveHoursAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parseHoursForm(formData);
  if ("error" in parsed) return parsed;
  const { rows } = parsed;

  db.transaction((tx) => {
    tx.delete(availability).run();
    if (rows.length) tx.insert(availability).values(rows).run();
  });
  revalidatePath("/dashboard/availability");
  return { success: "Default hours saved. They pre-fill the hours of staff you add next." };
}

const blockSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  reason: z.string().trim().optional().transform((v) => v || null),
});

export async function addBlockedDateAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = blockSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  db.insert(blockedDate)
    .values(parsed.data)
    .onConflictDoUpdate({ target: blockedDate.date, set: { reason: parsed.data.reason } })
    .run();
  revalidatePath("/dashboard/availability");
  return { success: "Date closed for all staff. Existing bookings on that day are not cancelled automatically." };
}

export async function removeBlockedDateAction(formData: FormData) {
  await requireAdmin();
  db.delete(blockedDate).where(eq(blockedDate.id, Number(formData.get("id")))).run();
  revalidatePath("/dashboard/availability");
}
