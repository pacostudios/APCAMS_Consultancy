import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, gte, inArray } from "drizzle-orm";
import { ArrowLeft, X } from "lucide-react";
import { db } from "@/db";
import { auditLog, booking, service, staffHours, staffTimeOff } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { formatDate, startOfBusinessDay, toDateKey, zoneLabel } from "@/lib/format";
import { getStaff } from "@/lib/staff";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import AuditList from "../../_components/AuditList";
import BookingTable from "../../_components/BookingTable";
import { Card, EmptyState, Field, PageHeader, inputClass } from "../../_components/ui";
import { listAudit, listBookings } from "../../_lib/queries";
import HoursEditor from "../../availability/_components/HoursEditor";
import StaffFields from "../_components/StaffFields";
import {
  addStaffTimeOffAction,
  removeStaffTimeOffAction,
  resetStaffPasswordAction,
  saveStaffHoursAction,
  updateStaffAction,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function StaffDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { created } = await searchParams;
  const member = getStaff(Number(id));
  if (!member) notFound();

  const today = toDateKey(new Date());
  const services = db.select({ id: service.id, name: service.name, active: service.active }).from(service).orderBy(asc(service.sortOrder)).all();
  const hours = db
    .select({ weekday: staffHours.weekday, startTime: staffHours.startTime, endTime: staffHours.endTime })
    .from(staffHours)
    .where(eq(staffHours.staffId, member.id))
    .orderBy(asc(staffHours.weekday), asc(staffHours.startTime))
    .all();
  const timeOff = db
    .select()
    .from(staffTimeOff)
    .where(and(eq(staffTimeOff.staffId, member.id), gte(staffTimeOff.date, today)))
    .orderBy(asc(staffTimeOff.date))
    .all();
  const upcoming = listBookings({
    where: and(eq(booking.staffId, member.id), inArray(booking.status, ["pending", "confirmed"]), gte(booking.startsAt, new Date())),
    limit: 50,
  });
  const activity = listAudit({ where: eq(auditLog.staffId, member.id), limit: 30 });

  return (
    <>
      <Link href="/dashboard/staff" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} /> Staff
      </Link>
      <PageHeader title={member.name} description={`${member.title ? `${member.title} · ` : ""}${member.email}${member.active ? "" : " · Inactive"}`} />

      {created && (
        <p role="status" className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {member.name} can now sign in at <span className="font-medium">/dashboard/login</span> with {member.email} and the password you set.
          Check their weekly hours below.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-3">
          <Card title="Profile & services">
            <ActionForm action={updateStaffAction} className="space-y-6">
              <input type="hidden" name="id" value={member.id} />
              <StaffFields services={services} defaults={member} />
              <div className="flex justify-end"><SubmitButton>Save profile</SubmitButton></div>
            </ActionForm>
          </Card>

          <Card title={`Weekly hours (${zoneLabel()})`}>
            <HoursEditor initial={hours} action={saveStaffHoursAction} hidden={{ staffId: String(member.id) }} submitLabel="Save weekly hours" />
          </Card>

          <Card title="Upcoming bookings">
            {upcoming.length ? <BookingTable rows={upcoming} showPayment={false} /> : <EmptyState message="No upcoming bookings." />}
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <Card title="Days off">
            <ActionForm action={addStaffTimeOffAction} resetOnSuccess className="space-y-4">
              <input type="hidden" name="staffId" value={member.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date" htmlFor="date">
                  <input id="date" name="date" type="date" min={today} required className={inputClass} />
                </Field>
                <Field label="Reason (optional)" htmlFor="reason">
                  <input id="reason" name="reason" placeholder="e.g. Annual leave" className={inputClass} />
                </Field>
              </div>
              <div className="flex justify-end"><SubmitButton>Add day off</SubmitButton></div>
            </ActionForm>
            {timeOff.length > 0 && (
              <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                {timeOff.map((d) => (
                  <li key={d.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{formatDate(startOfBusinessDay(d.date))}</p>
                      {d.reason && <p className="text-xs text-slate-500">{d.reason}</p>}
                    </div>
                    <form action={removeStaffTimeOffAction}>
                      <input type="hidden" name="id" value={d.id} />
                      <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Remove day off ${d.date}`}>
                        <X size={16} />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Set a new password">
            <ActionForm action={resetStaffPasswordAction} resetOnSuccess className="space-y-4">
              <input type="hidden" name="id" value={member.id} />
              <Field label="New password" htmlFor="new-password" hint="At least 8 characters. They'll be signed out everywhere.">
                <input id="new-password" name="password" type="text" required minLength={8} autoComplete="new-password" className={inputClass} />
              </Field>
              <div className="flex justify-end"><SubmitButton variant="secondary">Set password</SubmitButton></div>
            </ActionForm>
          </Card>

          <Card title="Recent activity" actions={<Link href={`/dashboard/audit?staff=${member.id}`} className="text-sm font-medium text-[#2B6F6F] hover:underline">All</Link>}>
            <AuditList rows={activity} linkBookings />
          </Card>
        </div>
      </div>
    </>
  );
}
