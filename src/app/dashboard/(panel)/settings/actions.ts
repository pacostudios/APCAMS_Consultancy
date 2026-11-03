"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { setSiteSetting } from "@/lib/site-settings";
import type { ActionResult } from "../_components/ActionForm";

const hotlineSchema = z.object({
  suicideHotlinePhone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{3,20}$/, "Enter a valid phone number, e.g. +61 2 1234 5678 or 13 11 14."),
});

export async function saveHotlineAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = hotlineSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  setSiteSetting("suicideHotlinePhone", parsed.data.suicideHotlinePhone);
  revalidatePath("/");
  revalidatePath("/dashboard/settings");
  return { success: "Hotline number saved. It now shows on the home page." };
}
