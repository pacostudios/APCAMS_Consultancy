"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { booking, client } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import type { ActionResult } from "../_components/ActionForm";

const optional = z.string().trim().optional().transform((v) => v || null);

const clientSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    email: z.union([z.literal(""), z.email("Enter a valid email.")]).optional().transform((v) => v?.toLowerCase() || null),
    phone: optional,
    address: optional,
    notes: optional,
  })
  .refine((c) => c.email || c.phone, { message: "Enter an email or phone number." });

function isUniqueEmailError(e: unknown) {
  return e instanceof Error && /UNIQUE constraint failed: client\.email/.test(e.message);
}

export async function createClientAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let id: number;
  try {
    id = db.insert(client).values(parsed.data).returning({ id: client.id }).get().id;
  } catch (e) {
    if (isUniqueEmailError(e)) return { error: "A client with that email already exists." };
    throw e;
  }
  revalidatePath("/dashboard", "layout");
  redirect(`/dashboard/clients/${id}`);
}

export async function updateClientAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    db.update(client).set(parsed.data).where(eq(client.id, id)).run();
  } catch (e) {
    if (isUniqueEmailError(e)) return { error: "Another client already uses that email." };
    throw e;
  }
  revalidatePath("/dashboard", "layout");
  return { success: "Client saved." };
}

export async function deleteClientAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const [{ n }] = db.select({ n: count() }).from(booking).where(eq(booking.clientId, id)).all();
  if (n > 0) return { error: "This client has bookings, so they can't be deleted. Their history is kept for your records." };
  db.delete(client).where(eq(client.id, id)).run();
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/clients");
}
