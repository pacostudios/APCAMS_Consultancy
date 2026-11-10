import { and, eq, gte, inArray, lt } from "drizzle-orm";
import { CalendarCheck, CalendarDays, Clock } from "lucide-react";
import { booking } from "@/db/schema";
import { requireStaff } from "@/lib/admin";
import { addDaysToKey, formatTime, startOfBusinessDay, toDateKey, zoneLabel } from "@/lib/format";
import BookingTable from "@/app/dashboard/(panel)/_components/BookingTable";
import { Card, EmptyState, FilterTabs, PageHeader, StatTile } from "@/app/dashboard/(panel)/_components/ui";
import { listBookings } from "@/app/dashboard/(panel)/_lib/queries";

export const dynamic = "force-dynamic";

const TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function StaffBookingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { staff: me, user } = await requireStaff();
  const params = await searchParams;
  const tab = TABS.find((t) => t.value === params.tab)?.value ?? "upcoming";
  const now = new Date();
  const mine = eq(booking.staffId, me.id);
  const active = inArray(booking.status, ["pending", "confirmed"]);

  const rows = listBookings(
    tab === "upcoming"
      ? { where: and(mine, active, gte(booking.endsAt, now)) }
      : tab === "past"
        ? { where: and(mine, inArray(booking.status, ["completed", "no_show", "confirmed", "pending"]), lt(booking.endsAt, now)), order: "desc", limit: 100 }
        : { where: and(mine, eq(booking.status, "cancelled")), order: "desc", limit: 100 },
  );

  const today = toDateKey(now);
  const todays = listBookings({
    where: and(mine, active, gte(booking.startsAt, startOfBusinessDay(today)), lt(booking.startsAt, startOfBusinessDay(addDaysToKey(today, 1)))),
  });
  const week = listBookings({ where: and(mine, active, gte(booking.startsAt, now), lt(booking.startsAt, startOfBusinessDay(addDaysToKey(today, 7)))) });
  const next = todays.find((b) => b.endsAt > now) ?? week[0];
  const toClose = listBookings({ where: and(mine, active, lt(booking.endsAt, now)) }).length;

  return (
    <>
      <PageHeader title={`Hi, ${user.name.split(" ")[0]}`} description={`Your sessions. Times are ${zoneLabel()}.`} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatTile label="Today" value={String(todays.length)} hint={todays.length === 1 ? "session" : "sessions"} icon={<CalendarDays size={20} />} />
        <StatTile label="Next 7 days" value={String(week.length)} hint="upcoming" icon={<CalendarCheck size={20} />} />
        <StatTile label="Next session" value={next ? formatTime(next.startsAt) : "—"} hint={next ? `${next.clientName} · ${next.serviceName}` : "Nothing booked"} icon={<Clock size={20} />} />
      </div>
      {toClose > 0 && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {toClose} past {toClose === 1 ? "session is" : "sessions are"} still open. Mark them completed or no-show from the Past tab.
        </p>
      )}
      <div className="mb-4">
        <FilterTabs options={TABS} current={tab} param="tab" searchParams={params} basePath="/staff" />
      </div>
      <Card>
        {rows.length ? <BookingTable rows={rows} portal="staff" /> : <EmptyState message={tab === "upcoming" ? "No upcoming sessions." : "Nothing here yet."} />}
      </Card>
    </>
  );
}
