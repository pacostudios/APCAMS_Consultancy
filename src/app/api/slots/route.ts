import { NextResponse, type NextRequest } from "next/server";
import { getAvailableSlots } from "@/lib/bookings";
import { BUSINESS } from "@/lib/config";
import { addDaysToKey, toDateKey } from "@/lib/format";
import { dateKeyIn, localIn, normalizeZone, startOfDayIn, timeIn } from "@/lib/timezone";

export const dynamic = "force-dynamic";

/** How far ahead `first=1` looks for a day with free times. */
const MAX_DAYS_AHEAD = 31;

/**
 * GET /api/slots?date=YYYY-MM-DD&service=<id>[&staff=<id>][&tz=<IANA zone>] → free start times on that day,
 * across every staff member who provides the service, or just one.
 * GET /api/slots?first=1&service=<id>[&days=N][&tz=<IANA zone>] → the first day from today that has free times,
 * with its times (`date` is null if none within N days).
 *
 * Days and times are in `tz` (the customer's zone), or business time without it.
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const serviceId = Number(params.get("service"));
  const staffId = Number(params.get("staff")) || undefined;
  const zone = normalizeZone(params.get("tz")) ?? BUSINESS.timezone;
  const now = new Date();
  const toSlots = (dates: Date[]) =>
    dates.map((d) => ({
      start: d.toISOString(),
      local: localIn(d, zone), // "YYYY-MM-DDTHH:mm"
      label: timeIn(d, zone),
    }));

  /** One day in the customer's zone can fall across two or three business days, so collect from each of them. */
  const slotsOn = (date: string) => {
    const from = startOfDayIn(date, zone).getTime();
    const to = startOfDayIn(addDaysToKey(date, 1), zone).getTime();
    const last = toDateKey(new Date(to - 1));
    const found: Date[] = [];
    for (let key = toDateKey(new Date(from)); key <= last; key = addDaysToKey(key, 1)) {
      found.push(...getAvailableSlots(key, serviceId, now, staffId).filter((d) => d.getTime() >= from && d.getTime() < to));
    }
    return found;
  };

  if (params.get("first") === "1" && serviceId) {
    const days = Math.min(Math.max(Number(params.get("days")) || 14, 1), MAX_DAYS_AHEAD);
    const today = dateKeyIn(now, zone);
    for (let i = 0; i < days; i++) {
      const date = addDaysToKey(today, i);
      const slots = slotsOn(date);
      if (slots.length) return NextResponse.json({ date, slots: toSlots(slots) });
    }
    return NextResponse.json({ date: null, slots: [] });
  }

  const date = params.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || !serviceId) {
    return NextResponse.json({ error: "date (YYYY-MM-DD) and service are required" }, { status: 400 });
  }
  return NextResponse.json({ date, slots: toSlots(slotsOn(date)) });
}
