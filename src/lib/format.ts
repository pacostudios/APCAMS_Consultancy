import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { BUSINESS } from "./config";
import { dayIn, sameClock, timeIn, zoneCity, zoneName } from "./timezone";

const { timezone: TZ, locale, currency } = BUSINESS;

const money = new Intl.NumberFormat(locale, { style: "currency", currency });

export const formatAUD = (cents: number) => money.format(cents / 100);

export const formatDate = (d: Date) =>
  d.toLocaleDateString(locale, { timeZone: TZ, day: "2-digit", month: "short", year: "numeric" });

export const formatWeekdayDate = (d: Date) =>
  d.toLocaleDateString(locale, { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });

export const formatTime = (d: Date) =>
  d.toLocaleTimeString(locale, { timeZone: TZ, hour: "numeric", minute: "2-digit" });

export const formatDateTime = (d: Date) => `${formatDate(d)}, ${formatTime(d)}`;

/** "Perth time". Clearer than AEDT/AEST for readers outside Australia. */
export const zoneLabel = () => `${zoneCity(TZ)} time`;

/** "Tue, 25 Nov, 5:00 pm Perth time" */
export const businessWhen = (start: Date, end?: Date) =>
  `${formatWeekdayDate(start)}, ${formatTime(start)}${end ? ` – ${formatTime(end)}` : ""} ${zoneLabel()}`;

/**
 * "Tue, 25 Nov, 11:30 am (Kolkata, GMT+5:30)": the session in the zone the customer booked from.
 * Null when that zone is unknown or its clock matches business time, so there's nothing extra to show.
 */
export const clientWhen = (b: { startsAt: Date; clientTimezone: string | null }, end?: Date) =>
  b.clientTimezone && !sameClock(b.startsAt, b.clientTimezone, TZ)
    ? `${dayIn(b.startsAt, b.clientTimezone)}, ${timeIn(b.startsAt, b.clientTimezone)}${end ? ` – ${timeIn(end, b.clientTimezone)}` : ""} (${zoneName(b.startsAt, b.clientTimezone)})`
    : null;

/** "YYYY-MM-DD" for the given moment in the business timezone. */
export const toDateKey = (d: Date) => formatInTimeZone(d, TZ, "yyyy-MM-dd");

/** "YYYY-MM" for the given moment in the business timezone. */
export const toMonthKey = (d: Date) => formatInTimeZone(d, TZ, "yyyy-MM");

/** Value for an <input type="datetime-local"> showing the moment in business time. */
export const toLocalInput = (d: Date) => formatInTimeZone(d, TZ, "yyyy-MM-dd'T'HH:mm");

/** Interpret a wall-clock time in the business timezone ("2026-11-03T09:30") as a real instant. */
export const fromBusinessTime = (local: string) => fromZonedTime(local, TZ);

/** Start of the given business-time day as an instant. */
export const startOfBusinessDay = (dateKey: string) => fromZonedTime(`${dateKey}T00:00:00`, TZ);

/** Add whole days to a "YYYY-MM-DD" key (calendar maths, unaffected by DST). */
export function addDaysToKey(dateKey: string, days: number) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

/** Weekday (0 = Sunday) of a "YYYY-MM-DD" key. */
export function weekdayOfKey(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export const parseDollarsToCents = (value: string) => Math.round(parseFloat(value) * 100);
