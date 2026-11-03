"use client";

import { useState } from "react";
import { formatAUD } from "@/lib/format";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Field, inputClass } from "../../_components/ui";
import { createBookingAction } from "../actions";
import SlotPicker from "./SlotPicker";

type Option = { id: number; name: string };
type ServiceOption = Option & { priceCents: number; durationMins: number };
export type StaffOption = Option & { serviceIds: number[] };

export default function NewBookingForm({ clients, services, staff, defaultClientId }: {
  clients: (Option & { email: string | null; phone: string | null })[];
  services: ServiceOption[];
  staff: StaffOption[];
  defaultClientId?: number;
}) {
  const [isNew, setIsNew] = useState(!defaultClientId && clients.length === 0);
  const [serviceId, setServiceId] = useState(String(services[0]?.id ?? ""));
  const [staffId, setStaffId] = useState("");
  const [mode, setMode] = useState("in_person");
  const qualified = staff.filter((s) => s.serviceIds.includes(Number(serviceId)));

  return (
    <ActionForm action={createBookingAction} className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold text-slate-900">Client</legend>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm w-fit">
          <button type="button" onClick={() => setIsNew(false)} disabled={clients.length === 0}
            className={`rounded-md px-3 py-1.5 font-medium ${!isNew ? "bg-white shadow-sm" : "text-slate-600"}`}>
            Existing client
          </button>
          <button type="button" onClick={() => setIsNew(true)}
            className={`rounded-md px-3 py-1.5 font-medium ${isNew ? "bg-white shadow-sm" : "text-slate-600"}`}>
            New client
          </button>
        </div>

        {isNew ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Full name" htmlFor="name"><input id="name" name="name" required className={inputClass} /></Field>
            <Field label="Email" htmlFor="email"><input id="email" name="email" type="email" className={inputClass} /></Field>
            <Field label="Phone" htmlFor="phone"><input id="phone" name="phone" type="tel" placeholder="04xx xxx xxx" className={inputClass} /></Field>
          </div>
        ) : (
          <Field label="Client" htmlFor="clientId">
            <select id="clientId" name="clientId" defaultValue={defaultClientId} required className={inputClass}>
              <option value="">Choose a client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.email ? `· ${c.email}` : c.phone ? `· ${c.phone}` : ""}
                </option>
              ))}
            </select>
          </Field>
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold text-slate-900">Appointment</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Service" htmlFor="serviceId">
            <select id="serviceId" name="serviceId" value={serviceId}
              onChange={(e) => { setServiceId(e.target.value); setStaffId(""); }} className={inputClass}>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.durationMins} min · {formatAUD(s.priceCents)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Staff" htmlFor="staffId"
            hint={qualified.length ? "Auto-assign picks whoever is free then, with the fewest bookings that day." : "No active staff provide this service yet."}>
            <select id="staffId" name="staffId" value={staffId} onChange={(e) => setStaffId(e.target.value)} className={inputClass}>
              <option value="">Auto-assign</option>
              {qualified.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Date & time" htmlFor="startsAt">
            <SlotPicker serviceId={serviceId} staffId={staffId} />
          </Field>
          <Field label="Format" htmlFor="mode">
            <select id="mode" name="mode" value={mode} onChange={(e) => setMode(e.target.value)} className={inputClass}>
              <option value="in_person">In person</option>
              <option value="online">Online</option>
            </select>
          </Field>
          <Field label="Status" htmlFor="status">
            <select id="status" name="status" defaultValue="confirmed" className={inputClass}>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
            </select>
          </Field>
          {mode === "online" && (
            <Field label="Meeting link" htmlFor="meetingUrl" hint="Leave blank for online sessions to create a Zoom meeting automatically">
              <input id="meetingUrl" name="meetingUrl" type="url" placeholder="https://" className={inputClass} />
            </Field>
          )}
        </div>
        <Field label="Internal notes" htmlFor="adminNotes" hint="Only visible to admins.">
          <textarea id="adminNotes" name="adminNotes" rows={3} className={inputClass} />
        </Field>
      </fieldset>

      <div className="flex justify-end">
        <SubmitButton>Create booking</SubmitButton>
      </div>
    </ActionForm>
  );
}
