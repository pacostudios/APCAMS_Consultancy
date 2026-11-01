import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft, Mail, MapPin, Phone, Video } from "lucide-react";
import { db } from "@/db";
import { BOOKING_STATUSES, PAYMENT_STATUSES, booking, client, service, type BookingStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { formatAUD, formatDateTime, formatTime, formatWeekdayDate, toLocalInput, zoneLabel } from "@/lib/format";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, Field, PageHeader, PaymentBadge, StatusBadge, bookingStatusLabel, buttonClass, inputClass, paymentStatusLabel } from "../../_components/ui";
import { rescheduleBookingAction, setBookingStatusAction, updateBookingAction } from "../actions";
import RescheduleFields from "../_components/RescheduleFields";

export const dynamic = "force-dynamic";

const QUICK_ACTIONS: Partial<Record<BookingStatus, { status: BookingStatus; label: string; variant: keyof typeof buttonClass }[]>> = {
  pending: [
    { status: "confirmed", label: "Confirm", variant: "primary" },
    { status: "cancelled", label: "Cancel booking", variant: "danger" },
  ],
  confirmed: [
    { status: "completed", label: "Mark completed", variant: "primary" },
    { status: "no_show", label: "Mark no-show", variant: "secondary" },
    { status: "cancelled", label: "Cancel booking", variant: "danger" },
  ],
  cancelled: [{ status: "pending", label: "Restore as pending", variant: "secondary" }],
};

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const row = db
    .select({ booking, client, service })
    .from(booking)
    .innerJoin(client, eq(booking.clientId, client.id))
    .innerJoin(service, eq(booking.serviceId, service.id))
    .where(eq(booking.id, Number(id)))
    .get();
  if (!row) notFound();
  const { booking: b, client: c, service: s } = row;

  const services = db.select({ id: service.id, name: service.name, durationMins: service.durationMins })
    .from(service).orderBy(asc(service.sortOrder)).all();
  const quick = QUICK_ACTIONS[b.status] ?? [];

  return (
    <>
      <Link href="/dashboard/bookings" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} /> Bookings
      </Link>
      <PageHeader
        title={`${s.name} with ${c.name}`}
        description={`${b.reference} · ${formatWeekdayDate(b.startsAt)}, ${formatTime(b.startsAt)}–${formatTime(b.endsAt)} ${zoneLabel(b.startsAt)}`}
        actions={
          <>
            {quick.map((a) => (
              <form key={a.status} action={setBookingStatusAction}>
                <input type="hidden" name="id" value={b.id} />
                <input type="hidden" name="status" value={a.status} />
                <SubmitButton variant={a.variant} confirm={a.status === "cancelled" ? "Cancel this booking?" : undefined}>
                  {a.label}
                </SubmitButton>
              </form>
            ))}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Summary">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              <div><dt className="text-slate-500">Status</dt><dd className="mt-1"><StatusBadge status={b.status} /></dd></div>
              <div><dt className="text-slate-500">Payment</dt><dd className="mt-1"><PaymentBadge status={b.paymentStatus} /></dd></div>
              <div><dt className="text-slate-500">Amount</dt><dd className="mt-1 font-medium tabular-nums text-slate-900">{formatAUD(b.priceCents)}</dd></div>
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
              {b.clientNotes && (
                <div className="col-span-full"><dt className="text-slate-500">Client&apos;s notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-slate-900">{b.clientNotes}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card title="Edit booking">
            <ActionForm action={updateBookingAction} className="space-y-4">
              <input type="hidden" name="id" value={b.id} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Status" htmlFor="status">
                  <select id="status" name="status" defaultValue={b.status} className={inputClass}>
                    {BOOKING_STATUSES.map((v) => <option key={v} value={v}>{bookingStatusLabel(v)}</option>)}
                  </select>
                </Field>
                <Field label="Payment" htmlFor="paymentStatus">
                  <select id="paymentStatus" name="paymentStatus" defaultValue={b.paymentStatus} className={inputClass}>
                    {PAYMENT_STATUSES.map((v) => <option key={v} value={v}>{paymentStatusLabel(v)}</option>)}
                  </select>
                </Field>
                <Field label="Format" htmlFor="mode">
                  <select id="mode" name="mode" defaultValue={b.mode} className={inputClass}>
                    <option value="in_person">In person</option>
                    <option value="online">Online</option>
                  </select>
                </Field>
              </div>
              <Field label="Meeting link" htmlFor="meetingUrl" hint="For online sessions (Zoom / Google Meet).">
                <input id="meetingUrl" name="meetingUrl" type="url" defaultValue={b.meetingUrl ?? ""} placeholder="https://" className={inputClass} />
              </Field>
              <Field label="Internal notes" htmlFor="adminNotes" hint="Only visible to admins.">
                <textarea id="adminNotes" name="adminNotes" rows={4} defaultValue={b.adminNotes ?? ""} className={inputClass} />
              </Field>
              <div className="flex justify-end"><SubmitButton>Save changes</SubmitButton></div>
            </ActionForm>
          </Card>

          <Card title="Reschedule">
            <ActionForm action={rescheduleBookingAction} className="space-y-4">
              <input type="hidden" name="id" value={b.id} />
              <RescheduleFields services={services} defaultServiceId={String(s.id)} defaultStartsAt={toLocalInput(b.startsAt)} />
              <div className="flex justify-end"><SubmitButton variant="secondary">Reschedule</SubmitButton></div>
            </ActionForm>
          </Card>
        </div>

        <Card title="Client" className="self-start" actions={<Link href={`/dashboard/clients/${c.id}`} className="text-sm font-medium text-[#2B6F6F] hover:underline">Profile</Link>}>
          <p className="font-semibold text-slate-900">{c.name}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {c.email && <li className="flex items-center gap-2"><Mail size={14} /><a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a></li>}
            {c.phone && <li className="flex items-center gap-2"><Phone size={14} /><a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a></li>}
            {c.address && <li className="flex items-center gap-2"><MapPin size={14} />{c.address}</li>}
          </ul>
          {c.notes && <p className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{c.notes}</p>}
        </Card>
      </div>
    </>
  );
}
