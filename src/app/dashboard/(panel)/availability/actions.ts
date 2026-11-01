"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { availability, blockedDate } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import type { ActionResult } from "../_components/ActionForm";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Times must be HH:MM.");
const hoursSchema = z.array(z.object({ weekday: z.number().int().min(0).max(6), startTime: time, endTime: time }));

export async function saveHoursAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  let rows;
  try {
    rows = hoursSchema.parse(JSON.parse(String(formData.get("hours"))));
  } catch {
    return { error: "Couldn't read the hours. Check every time is filled in." };
  }

  for (const r of rows) {
    if (r.startTime >= r.endTime) return { error: "Each block must end after it starts." };
  }
  // Blocks on the same day must not overlap.
  for (let day = 0; day < 7; day++) {
    const blocks = rows.filter((r) => r.weekday === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].startTime < blocks[i - 1].endTime) return { error: "Two time blocks on the same day overlap." };
    }
  }

  db.transaction((tx) => {
    tx.delete(availability).run();
    if (rows.length) tx.insert(availability).values(rows).run();
  });
  revalidatePath("/dashboard/availability");
  return { success: "Working hours saved." };
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
  return { success: "Date closed. Existing bookings on that day are not cancelled automatically." };
}

export async function removeBlockedDateAction(formData: FormData) {
  await requireAdmin();
  db.delete(blockedDate).where(eq(blockedDate.id, Number(formData.get("id")))).run();
  revalidatePath("/dashboard/availability");
}
