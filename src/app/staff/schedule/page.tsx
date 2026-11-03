import { and, asc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/db";
import { blockedDate, service, staffHours, staffService, staffTimeOff } from "@/db/schema";
import { requireStaff } from "@/lib/admin";
import { formatDate, startOfBusinessDay, toDateKey, zoneLabel } from "@/lib/format";
import { Card, EmptyState, PageHeader } from "@/app/dashboard/(panel)/_components/ui";

export const dynamic = "force-dynamic";

// Monday first, as Australians read a week.
const DAYS = [
  { n: 1, label: "Monday" }, { n: 2, label: "Tuesday" }, { n: 3, label: "Wednesday" },
  { n: 4, label: "Thursday" }, { n: 5, label: "Friday" }, { n: 6, label: "Saturday" }, { n: 0, label: "Sunday" },
];

export default async function StaffSchedulePage() {
  const { staff: me } = await requireStaff();
  const today = toDateKey(new Date());

  const hours = db.select().from(staffHours).where(eq(staffHours.staffId, me.id)).orderBy(asc(staffHours.startTime)).all();
  const daysOff = db
    .select({ date: staffTimeOff.date, reason: staffTimeOff.reason })
    .from(staffTimeOff)
    .where(and(eq(staffTimeOff.staffId, me.id), gte(staffTimeOff.date, today)))
    .all();
  const closed = db.select({ date: blockedDate.date, reason: blockedDate.reason }).from(blockedDate).where(gte(blockedDate.date, today)).all();
  const away = [...daysOff.map((d) => ({ ...d, kind: "Day off" })), ...closed.map((d) => ({ ...d, kind: "Business closed" }))]
    .sort((a, b) => a.date.localeCompare(b.date));
  const serviceIds = db.select({ id: staffService.serviceId }).from(staffService).where(eq(staffService.staffId, me.id)).all().map((r) => r.id);
  const services = serviceIds.length
    ? db.select({ name: service.name }).from(service).where(inArray(service.id, serviceIds)).orderBy(asc(service.sortOrder)).all()
    : [];

  return (
    <>
      <PageHeader title="My hours" description={`When clients can book you, in ${zoneLabel()}. Ask the admin to change your hours, days off or services.`} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card title="Weekly hours" className="xl:col-span-3">
          <ul className="divide-y divide-slate-100">
            {DAYS.map((day) => {
              const blocks = hours.filter((h) => h.weekday === day.n);
              return (
                <li key={day.n} className="flex py-3 text-sm">
                  <span className="w-32 font-medium text-slate-900">{day.label}</span>
                  <span className={blocks.length ? "text-slate-700" : "text-slate-400"}>
                    {blocks.length ? blocks.map((b) => `${b.startTime}–${b.endTime}`).join(", ") : "Not working"}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
        <div className="space-y-6 xl:col-span-2">
          <Card title="Services you provide">
            {services.length ? (
              <ul className="space-y-1 text-sm text-slate-700">{services.map((s) => <li key={s.name}>{s.name}</li>)}</ul>
            ) : (
              <EmptyState message="None yet, so clients can't book you." />
            )}
          </Card>
          <Card title="Upcoming days off">
            {away.length ? (
              <ul className="divide-y divide-slate-100">
                {away.map((d) => (
                  <li key={`${d.kind}-${d.date}`} className="py-2.5">
                    <p className="text-sm font-medium text-slate-900">{formatDate(startOfBusinessDay(d.date))}</p>
                    <p className="text-xs text-slate-500">{d.kind}{d.reason ? ` · ${d.reason}` : ""}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No days off coming up." />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
