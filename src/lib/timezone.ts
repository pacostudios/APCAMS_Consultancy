/**
 * Time zone helpers shared by the browser and the server. Zones are IANA names ("Asia/Kolkata"), never fixed
 * offsets, so daylight saving is always right for the date being shown. Nothing here reads the business
 * settings: the browser can't see BUSINESS_TIMEZONE, so callers pass the zone in.
 */
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

/** Old names some browsers still report, e.g. Chrome in India says "Asia/Calcutta". */
const RENAMED: Record<string, string> = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Asia/Katmandu": "Asia/Kathmandu",
  "Asia/Rangoon": "Asia/Yangon",
  "Asia/Saigon": "Asia/Ho_Chi_Minh",
  "Asia/Dacca": "Asia/Dhaka",
  "Europe/Kiev": "Europe/Kyiv",
  "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
};

/** A usable zone name, or null if it isn't one. Safe to call on anything a browser sends. */
export function normalizeZone(zone: string | null | undefined): string | null {
  if (!zone || zone.length > 64 || !/^[A-Za-z][A-Za-z0-9_+\-/]*$/.test(zone)) return null;
  const name = RENAMED[zone] ?? zone;
  for (const candidate of [name, zone]) {
    try {
      new Intl.DateTimeFormat("en-AU", { timeZone: candidate });
      return candidate;
    } catch {
      // This runtime doesn't know the new name; fall back to the one it was given.
    }
  }
  return null;
}

/** The visitor's own zone, from their device. */
export function deviceZone(): string | null {
  return normalizeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
}

/** "Kolkata", "New York". */
export const zoneCity = (zone: string) => zone.split("/").at(-1)!.replace(/_/g, " ");

/** Offset at that moment, e.g. "GMT+5:30". */
const zoneOffset = (d: Date, zone: string) =>
  new Intl.DateTimeFormat("en-AU", { timeZone: zone, timeZoneName: "shortOffset" }).formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? "";

/** "Kolkata, GMT+5:30". City plus offset, because short names like IST mean several different zones. */
export const zoneName = (d: Date, zone: string) => [zoneCity(zone), zoneOffset(d, zone)].filter((s, i, a) => s && a.indexOf(s) === i).join(", ");

/** "11:30 am" */
export const timeIn = (d: Date, zone: string) => d.toLocaleTimeString("en-AU", { timeZone: zone, hour: "numeric", minute: "2-digit" });

/** "Tue, 25 Nov" */
export const dayIn = (d: Date, zone: string, locale = "en-AU") =>
  d.toLocaleDateString(locale, { timeZone: zone, weekday: "short", day: "numeric", month: "short" });

/** "YYYY-MM-DD" of the moment in that zone. */
export const dateKeyIn = (d: Date, zone: string) => formatInTimeZone(d, zone, "yyyy-MM-dd");

/** "YYYY-MM-DDTHH:mm" of the moment in that zone. */
export const localIn = (d: Date, zone: string) => formatInTimeZone(d, zone, "yyyy-MM-dd'T'HH:mm");

/** Midnight at the start of that day in that zone, as an instant. */
export const startOfDayIn = (dateKey: string, zone: string) => fromZonedTime(`${dateKey}T00:00:00`, zone);

/** Whether both zones' clocks read the same at that moment (Sydney and Melbourne do), so showing both is noise. */
export const sameClock = (d: Date, a: string, b: string) => localIn(d, a) === localIn(d, b);
