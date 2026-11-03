import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSetting } from "@/db/schema";

/** Settings the admin can change under Dashboard → Settings, with the value used until they do. */
export const SITE_SETTING_DEFAULTS = {
  suicideHotlinePhone: "+91 6282584049",
} as const;

export type SiteSettingKey = keyof typeof SITE_SETTING_DEFAULTS;

export function getSiteSetting(key: SiteSettingKey): string {
  return db.select({ value: siteSetting.value }).from(siteSetting).where(eq(siteSetting.key, key)).get()?.value ?? SITE_SETTING_DEFAULTS[key];
}

export function setSiteSetting(key: SiteSettingKey, value: string) {
  db.insert(siteSetting)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteSetting.key, set: { value, updatedAt: new Date() } })
    .run();
}

/** "+91 6282 584 049" → "+916282584049": what a tel: link should dial. */
export const toTelHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
