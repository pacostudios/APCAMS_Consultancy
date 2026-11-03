import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Mail, MapPin, Phone, Video } from "lucide-react";
import { db } from "@/db";
import { auditLog, booking, client, service } from "@/db/schema";
import { requireStaff } from "@/lib/admin";
import { releaseExpiredHolds } from "@/lib/bookings";
import { formatDateTime, formatTime, formatWeekdayDate, toLocalInput, zoneLabel } from "@/lib/format";
import { ActionForm, SubmitButton } from "@/app/dashboard/(panel)/_components/ActionForm";
import AuditList from "@/app/dashboard/(panel)/_components/AuditList";
import { Card, Field, JoinMeetingButton, PageHeader, StatusBadge } from "@/app/dashboard/(panel)/_components/ui";
import { listAudit } from "@/app/dashboard/(panel)/_lib/queries";
import SlotPicker from "@/app/dashboard/(panel)/bookings/_components/SlotPicker";
import { staffRescheduleAction, staffSetStatusAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function StaffBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { staff: me } = await requireStaff();
  const { id } = await params;
  releaseExpiredHolds();

  const row = db
    .select({ booking, client, service })
    .from(booking)
    .innerJoin(client, eq(booking.clientId, client.id))
    .innerJoin(service, eq(booking.serviceId, service.id))
    .where(and(eq(booking.id, Number(id)), eq(booking.staffId, me.id)))
    .get();
  if (!row) notFound();
  const { booking: b, client: c, service: s } = row;

  const isActive = b.status === "pending" || b.status === "confirmed";
  const started = b.startsAt <= new Date();
  const history = listAudit({ where: eq(auditLog.bookingId, b.id), limit: 100 });

  return (
    <>
      <Link href="/staff" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} /> My bookings
      </Link>
      <PageHeader
        title={`${s.name} with ${c.name}`}
        description={`${b.reference} · ${formatWeekdayDate(b.startsAt)}, ${formatTime(b.startsAt)}–${formatTime(b.endsAt)} ${zoneLabel(b.startsAt)}`}
        actions={<JoinMeetingButton booking={b} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Summary">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              <div><dt className="text-slate-500">Status</dt><dd className="mt-1"><StatusBadge status={b.status} /></dd></div>
              <div><dt className="text-slate-500">Format</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-slate-900">
                  {b.mode === "online" ? <><Video size={14} /> Online</> : <><MapPin size={14} /> In person</>}
                </dd>
              </div>
              <div><dt className="text-slate-500">Duration</dt><dd className="mt-1 text-slate-900">{Math.round((b.endsAt.getTime() - b.startsAt.getTime()) / 60000)} min</dd></div>
              <div><dt className="text-slate-500">Booked on</dt><dd className="mt-1 text-slate-900">{formatDateTime(b.createdAt)}</dd></div>
              {b.meetingUrl && (
                <div className="col-span-full"><dt className="text-slate-500">Meeting link</dt>
                  <dd className="mt-1 truncate"><a href={b.meetingUrl} target="_blank" rel="noreferrer" className="text-[#2B6F6F] hover:underline">{b.meetingUrl}</a></dd>
                </div>
              )}
              {b.status === "pending" && b.holdExpiresAt && b.paymentStatus === "unpaid" && (
                <div className="col-span-full rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                  The client hasn&apos;t paid yet. The slot is released at {formatTime(b.holdExpiresAt)} if they don&apos;t.
                </div>
              )}
              {b.clientNotes && (
                <div className="col-span-full"><dt className="text-slate-500">Client&apos;s notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-slate-900">{b.clientNotes}</dd>
                </div>
              )}
            </dl>
          </Card>

          {isActive && (
            <Card title="Update">
              <div className="flex flex-wrap gap-3">
                {started && (
                  <>
                    <ActionForm action={staffSetStatusAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="completed" />
                      <SubmitButton>Mark completed</SubmitButton>
                    </ActionForm>
                    <ActionForm action={staffSetStatusAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="no_show" />
                      <SubmitButton variant="secondary">Mark no-show</SubmitButton>
                    </ActionForm>
                  </>
                )}
                <ActionForm action={staffSetStatusAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="status" value="cancelled" />
                  <SubmitButton variant="danger" confirm="Cancel this booking? The admin will see this in the audit log.">Cancel booking</SubmitButton>
                </ActionForm>
              </div>
              {!started && <p className="mt-3 text-xs text-slate-500">Completed and no-show become available once the session starts.</p>}
            </Card>
          )}

          {isActive && !started && (
            <Card title="Reschedule">
              <ActionForm action={staffRescheduleAction} className="space-y-4">
                <input type="hidden" name="id" value={b.id} />
                <Field label="New date & time" htmlFor="startsAt" hint="Suggested times come from your working hours. The time must not clash with your other sessions.">
                  <SlotPicker serviceId={String(s.id)} staffId={String(me.id)} defaultValue={toLocalInput(b.startsAt)} />
                </Field>
                <div className="flex justify-end"><SubmitButton variant="secondary">Reschedule</SubmitButton></div>
              </ActionForm>
            </Card>
          )}

          <Card title="History">
            <AuditList rows={history} />
          </Card>
        </div>

        <Card title="Client" className="self-start">
          <p className="font-semibold text-slate-900">{c.name}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {c.email && <li className="flex items-center gap-2"><Mail size={14} /><a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a></li>}
            {c.phone && <li className="flex items-center gap-2"><Phone size={14} /><a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a></li>}
            {c.address && <li className="flex items-center gap-2"><MapPin size={14} />{c.address}</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}
