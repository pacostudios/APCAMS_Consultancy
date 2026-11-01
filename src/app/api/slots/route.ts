import { NextResponse, type NextRequest } from "next/server";
import { getAvailableSlots } from "@/lib/bookings";
import { formatTime, toLocalInput } from "@/lib/format";

export const dynamic = "force-dynamic";

/** GET /api/slots?date=YYYY-MM-DD&service=<id> → free start times in business time. */
export function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  const serviceId = Number(request.nextUrl.searchParams.get("service"));

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !serviceId) {
    return NextResponse.json({ error: "date (YYYY-MM-DD) and service are required" }, { status: 400 });
  }

  const slots = getAvailableSlots(date, serviceId).map((d) => ({
    start: d.toISOString(),
    local: toLocalInput(d), // "YYYY-MM-DDTHH:mm" in business time
    label: formatTime(d),
  }));
  return NextResponse.json({ date, slots });
}
