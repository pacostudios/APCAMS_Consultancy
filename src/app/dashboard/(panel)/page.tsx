import Link from "next/link";
import { and, count, eq, gte, lt, ne, sum } from "drizzle-orm";
import { AlertCircle, CalendarCheck, DollarSign, Users } from "lucide-react";
import { db } from "@/db";
import { booking, client } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { BUSINESS } from "@/lib/config";
import { addDaysToKey, formatAUD, formatTime, formatWeekdayDate, startOfBusinessDay, toDateKey, toMonthKey, zoneLabel } from "@/lib/format";
import { listBookings } from "./_lib/queries";
import BookingTable from "./_components/BookingTable";
import { buttonClass, Card, EmptyState, PageHeader, StatTile, StatusBadge } from "./_components/ui";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const admin = await requireAdmin();

  const now = new Date();
  const todayKey = toDateKey(now);
  const todayStart = startOfBusinessDay(todayKey);
  const tomorrowStart = startOfBusinessDay(addDaysToKey(todayKey, 1));
  const weekEnd = startOfBusinessDay(addDaysToKey(todayKey, 7));
  const monthStart = startOfBusinessDay(`${toMonthKey(now)}-01`);

  const active = ne(booking.status, "cancelled");

  const [{ value: todayCount }] = db.select({ value: count() }).from(booking)
    .where(and(active, gte(booking.startsAt, todayStart), lt(booking.startsAt, tomorrowStart))).all();
  const [{ value: weekCount }] = db.select({ value: count() }).from(booking)
    .where(and(active, gte(booking.startsAt, now), lt(booking.startsAt, weekEnd))).all();
  const [{ value: pendingCount }] = db.select({ value: count() }).from(booking)
    .where(and(eq(booking.status, "pending"), gte(booking.startsAt, now))).all();
  const [{ value: monthRevenue }] = db.select({ value: sum(booking.priceCents) }).from(booking)
    .where(and(eq(booking.paymentStatus, "paid"), gte(booking.startsAt, monthStart))).all();
  const [{ value: clientCount }] = db.select({ value: count() }).from(client).all();

  const upcoming = listBookings({ where: and(active, gte(booking.startsAt, now), lt(booking.startsAt, weekEnd)), limit: 10 });
  const pending = listBookings({ where: and(eq(booking.status, "pending"), gte(booking.startsAt, now)), limit: 5 });

  const hour = Number(new Intl.DateTimeFormat("en-AU", { hour: "numeric", hour12: false, timeZone: BUSINESS.timezone }).format(now));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader
        title={`${greeting}, ${admin.name.split(" ")[0]}`}
        description={`${formatWeekdayDate(now)} · times shown in ${zoneLabel(now)}`}
        actions={<Link href="/dashboard/bookings/new" className={buttonClass.primary}>New booking</Link>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Today" value={String(todayCount)} hint={`${weekCount} in the next 7 days`} icon={<CalendarCheck size={18} />} />
        <StatTile label="Awaiting confirmation" value={String(pendingCount)} hint="Upcoming pending requests" icon={<AlertCircle size={18} />} />
        <StatTile label="Revenue this month" value={formatAUD(Number(monthRevenue ?? 0))} hint="Paid bookings" icon={<DollarSign size={18} />} />
        <StatTile label="Clients" value={String(clientCount)} hint="All time" icon={<Users size={18} />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          title="Next 7 days"
          className="xl:col-span-2"
          actions={<Link href="/dashboard/bookings" className="text-sm font-medium text-[#2B6F6F] hover:underline">All bookings</Link>}
        >
          {upcoming.length ? (
            <div className="-mx-5 -my-5"><BookingTable rows={upcoming} showPayment={false} /></div>
          ) : (
            <EmptyState message="Nothing booked for the next 7 days." />
          )}
        </Card>

        <Card
          title="Needs your attention"
          actions={<Link href="/dashboard/bookings?status=pending" className="text-sm font-medium text-[#2B6F6F] hover:underline">View all</Link>}
        >
          {pending.length ? (
            <ul className="divide-y divide-slate-100">
              {pending.map((b) => (
                <li key={b.id}>
                  <Link href={`/dashboard/bookings/${b.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{b.clientName}</p>
                      <p className="truncate text-xs text-slate-500">
                        {formatWeekdayDate(b.startsAt)}, {formatTime(b.startsAt)} · {b.serviceName}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="All caught up. No pending requests." />
          )}
        </Card>
      </div>
    </>
  );
}
