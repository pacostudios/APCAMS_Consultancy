import { NextResponse, type NextRequest } from "next/server";
import { getAvailableSlots } from "@/lib/bookings";
import { addDaysToKey, formatTime, toDateKey, toLocalInput } from "@/lib/format";

export const dynamic = "force-dynamic";

/** How far ahead `first=1` looks for a day with free times. */
const MAX_DAYS_AHEAD = 31;

/**
 * GET /api/slots?date=YYYY-MM-DD&service=<id>[&staff=<id>] → free start times in business time,
 * across every staff member who provides the service, or just one.
 * GET /api/slots?first=1&service=<id>[&days=N] → the first day from today that has free times, with its times
 * (`date` is null if none within N days).
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const serviceId = Number(params.get("service"));
  const staffId = Number(params.get("staff")) || undefined;
  const now = new Date();
  const toSlots = (dates: Date[]) =>
    dates.map((d) => ({
      start: d.toISOString(),
      local: toLocalInput(d), // "YYYY-MM-DDTHH:mm" in business time
      label: formatTime(d),
    }));

  if (params.get("first") === "1" && serviceId) {
    const days = Math.min(Math.max(Number(params.get("days")) || 14, 1), MAX_DAYS_AHEAD);
    const today = toDateKey(now);
    for (let i = 0; i < days; i++) {
      const date = addDaysToKey(today, i);
      const slots = getAvailableSlots(date, serviceId, now, staffId);
      if (slots.length) return NextResponse.json({ date, slots: toSlots(slots) });
    }
    return NextResponse.json({ date: null, slots: [] });
  }

  const date = params.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !serviceId) {
    return NextResponse.json({ error: "date (YYYY-MM-DD) and service are required" }, { status: 400 });
  }
  return NextResponse.json({ date, slots: toSlots(getAvailableSlots(date, serviceId, now, staffId)) });
}
