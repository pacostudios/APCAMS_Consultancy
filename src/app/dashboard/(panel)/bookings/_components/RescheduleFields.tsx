"use client";

import { useState } from "react";
import { Field, inputClass } from "../../_components/ui";
import SlotPicker from "./SlotPicker";

export default function RescheduleFields({ services, defaultServiceId, defaultStartsAt }: {
  services: { id: number; name: string; durationMins: number }[];
  defaultServiceId: string;
  defaultStartsAt: string;
}) {
  const [serviceId, setServiceId] = useState(defaultServiceId);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Service" htmlFor="reschedule-service">
        <select id="reschedule-service" name="serviceId" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputClass}>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name} · {s.durationMins} min</option>
          ))}
        </select>
      </Field>
      <Field label="New date & time" htmlFor="startsAt">
        <SlotPicker serviceId={serviceId} defaultValue={defaultStartsAt} />
      </Field>
    </div>
  );
}
