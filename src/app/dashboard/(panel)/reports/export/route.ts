import { type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { formatInTimeZone } from "date-fns-tz";
import { BUSINESS } from "@/lib/config";
import { RANGES, bookingsInRange, resolveRange, type RangeKey } from "../_lib/report";

export const dynamic = "force-dynamic";

const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // Quote everything; neutralise spreadsheet formula injection.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(request: NextRequest) {
  await requireAdmin();
  const param = request.nextUrl.searchParams.get("range") ?? "this_month";
  const range: RangeKey = param in RANGES ? (param as RangeKey) : "this_month";
  const { from, to } = resolveRange(range);

  const tz = BUSINESS.timezone;
  const header = ["Reference", "Date", "Time", "Client", "Email", "Phone", "Service", "Format", "Status", "Payment", "Amount (AUD)"];
  const lines = bookingsInRange(from, to).map((b) =>
    [
      b.reference,
      formatInTimeZone(b.startsAt, tz, "yyyy-MM-dd"),
      formatInTimeZone(b.startsAt, tz, "HH:mm"),
      b.clientName,
      b.clientEmail,
      b.clientPhone,
      b.serviceName,
      b.mode === "online" ? "Online" : "In person",
      b.status,
      b.paymentStatus,
      (b.priceCents / 100).toFixed(2),
    ].map(csvCell).join(","),
  );

  const csv = "﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n"); // BOM so Excel reads UTF-8
  const filename = `apcams-bookings-${range}-${formatInTimeZone(new Date(), tz, "yyyy-MM-dd")}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
