"use server";

import { count, eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { booking, service } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import type { ActionResult } from "../_components/ActionForm";

const serviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  summary: z.string().trim().optional().transform((v) => v || null),
  price: z.coerce.number({ error: "Enter a price." }).min(0, "Price can't be negative."),
  durationMins: z.coerce.number().int().min(15, "Minimum 15 minutes.").max(480, "Maximum 8 hours."),
  sortOrder: z.coerce.number().int().default(0),
  active: z.literal("on").optional().transform((v) => v === "on"),
});

function toValues(data: z.infer<typeof serviceSchema>) {
  const { price, ...rest } = data;
  return { ...rest, priceCents: Math.round(price * 100) };
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "service";

/**
 * Slugs are internal: the hardcoded public service pages link to the booking form by slug.
 * Generated once from the name on create (`name`, `name-2`, `name-3`, ...) and never changed after.
 */
function uniqueSlug(name: string) {
  const base = slugify(name);
  const taken = new Set(
    db.select({ slug: service.slug }).from(service).where(like(service.slug, `${base}%`)).all().map((r) => r.slug),
  );
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

// The public site reads services too, so refresh everything.
const refresh = () => revalidatePath("/", "layout");

export async function createServiceAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  db.insert(service).values({ ...toValues(parsed.data), slug: uniqueSlug(parsed.data.name) }).run();
  refresh();
  redirect("/dashboard/services");
}

export async function updateServiceAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  // The slug is deliberately left out, so renaming a service never changes it.
  db.update(service).set(toValues(parsed.data)).where(eq(service.id, id)).run();
  refresh();
  return { success: "Service saved. Existing bookings keep the price they were booked at." };
}

export async function toggleServiceAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const current = db.select({ active: service.active }).from(service).where(eq(service.id, id)).get();
  if (!current) return;
  db.update(service).set({ active: !current.active }).where(eq(service.id, id)).run();
  refresh();
}

export async function deleteServiceAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const [{ n }] = db.select({ n: count() }).from(booking).where(eq(booking.serviceId, id)).all();
  if (n > 0) return { error: `This service has ${n} booking(s), so it can't be deleted. Deactivate it instead to hide it from the site.` };
  db.delete(service).where(eq(service.id, id)).run();
  refresh();
  redirect("/dashboard/services");
}
