import "server-only";
import { and, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import { booking, client, type BookingStatus } from "@/db/schema";
import { addDaysToKey, startOfBusinessDay, toDateKey, toMonthKey } from "@/lib/format";
import { listBookings } from "../../_lib/queries";

export const RANGES = {
  this_month: "This month",
  last_month: "Last month",
  last_3_months: "Last 3 months",
  last_12_months: "Last 12 months",
  this_year: "This calendar year",
  all: "All time",
} as const;

export type RangeKey = keyof typeof RANGES;

/** Month key arithmetic, e.g. shiftMonth("2026-01", -1) → "2025-12". */
export function shiftMonth(monthKey: string, delta: number) {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

/** [from, to) instants for a named range, in business time. */
export function resolveRange(key: RangeKey, now = new Date()): { from?: Date; to?: Date } {
  const month = toMonthKey(now);
  const tomorrow = startOfBusinessDay(addDaysToKey(toDateKey(now), 1));
  switch (key) {
    case "this_month":
      return { from: startOfBusinessDay(`${month}-01`), to: startOfBusinessDay(`${shiftMonth(month, 1)}-01`) };
    case "last_month":
      return { from: startOfBusinessDay(`${shiftMonth(month, -1)}-01`), to: startOfBusinessDay(`${month}-01`) };
    case "last_3_months":
      return { from: startOfBusinessDay(`${shiftMonth(month, -2)}-01`), to: tomorrow };
    case "last_12_months":
      return { from: startOfBusinessDay(`${shiftMonth(month, -11)}-01`), to: tomorrow };
    case "this_year":
      return { from: startOfBusinessDay(`${month.slice(0, 4)}-01-01`), to: startOfBusinessDay(`${Number(month.slice(0, 4)) + 1}-01-01`) };
    case "all":
      return {};
  }
}

export function bookingsInRange(from?: Date, to?: Date) {
  return listBookings({
    where: and(from ? gte(booking.startsAt, from) : undefined, to ? lt(booking.startsAt, to) : undefined),
    order: "asc",
  });
}

export function buildReport(range: RangeKey, now = new Date()) {
  const { from, to } = resolveRange(range, now);
  const rows = bookingsInRange(from, to);

  const byStatus = {} as Record<BookingStatus, number>;
  for (const s of ["pending", "confirmed", "completed", "cancelled", "no_show"] as const) byStatus[s] = 0;
  const byService = new Map<string, { bookings: number; revenue: number }>();
  let revenue = 0;
  let paidCount = 0;

  for (const b of rows) {
    byStatus[b.status]++;
    const svc = byService.get(b.serviceName) ?? { bookings: 0, revenue: 0 };
    if (b.status !== "cancelled") svc.bookings++;
    if (b.paymentStatus === "paid") {
      revenue += b.priceCents;
      paidCount++;
      svc.revenue += b.priceCents;
    }
    byService.set(b.serviceName, svc);
  }

  const total = rows.length;
  const lost = byStatus.cancelled + byStatus.no_show;

  const newClients = db
    .select({ id: client.id })
    .from(client)
    .where(and(from ? gte(client.createdAt, from) : undefined, to ? lt(client.createdAt, to) : undefined))
    .all().length;

  return {
    rows,
    total,
    revenue,
    avgValue: paidCount ? Math.round(revenue / paidCount) : 0,
    lostRate: total ? lost / total : 0,
    newClients,
    byStatus,
    byService: [...byService.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.revenue - a.revenue || b.bookings - a.bookings),
  };
}

/** Paid revenue and booking counts for each of the last 12 months (business time). */
export function monthlyTrend(now = new Date()) {
  const current = toMonthKey(now);
  const months = Array.from({ length: 12 }, (_, i) => shiftMonth(current, i - 11));
  const rows = bookingsInRange(startOfBusinessDay(`${months[0]}-01`), startOfBusinessDay(`${shiftMonth(current, 1)}-01`));

  const map = new Map(months.map((m) => [m, { revenue: 0, bookings: 0 }]));
  for (const b of rows) {
    const m = map.get(toMonthKey(b.startsAt));
    if (!m) continue;
    if (b.status !== "cancelled") m.bookings++;
    if (b.paymentStatus === "paid") m.revenue += b.priceCents;
  }
  return months.map((month) => ({ month, ...map.get(month)! }));
}
