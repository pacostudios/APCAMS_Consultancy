"use client";

import { useState } from "react";
import { Field, inputClass } from "../../_components/ui";
import type { StaffOption } from "./NewBookingForm";
import SlotPicker from "./SlotPicker";

export default function RescheduleFields({ services, staff, defaultServiceId, defaultStaffId, defaultStartsAt }: {
  services: { id: number; name: string; durationMins: number }[];
  staff: StaffOption[];
  defaultServiceId: string;
  defaultStaffId: string;
  defaultStartsAt: string;
}) {
  const [serviceId, setServiceId] = useState(defaultServiceId);
  const [staffId, setStaffId] = useState(defaultStaffId);
  const qualified = staff.filter((s) => s.serviceIds.includes(Number(serviceId)));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Service" htmlFor="reschedule-service">
        <select id="reschedule-service" name="serviceId" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputClass}>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name} · {s.durationMins} min</option>
          ))}
        </select>
      </Field>
      <Field label="Staff" htmlFor="reschedule-staff">
        <select id="reschedule-staff" name="staffId" value={staffId} onChange={(e) => setStaffId(e.target.value)} required className={inputClass}>
          <option value="">Choose a staff member…</option>
          {qualified.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </Field>
      <Field label="New date & time" htmlFor="startsAt">
        <SlotPicker serviceId={serviceId} staffId={staffId} defaultValue={defaultStartsAt} />
      </Field>
    </div>
  );
}
