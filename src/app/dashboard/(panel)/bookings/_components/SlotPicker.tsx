"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { inputClass } from "../../_components/ui";

type Slot = { local: string; label: string };

/**
 * Date + time picker. Suggests free slots from working hours as soon as a date is
 * chosen, but the admin can still type any time (e.g. to fit someone in after hours).
 * Submits a single "YYYY-MM-DDTHH:mm" business-time value under `name`.
 */
export default function SlotPicker({ serviceId, staffId = "", defaultValue = "", name = "startsAt" }: {
  serviceId: string;
  /** Suggest only this staff member's free times. Empty: any staff member who provides the service. */
  staffId?: string;
  defaultValue?: string;
  name?: string;
}) {
  const [date, setDate] = useState(defaultValue.slice(0, 10));
  const [time, setTime] = useState(defaultValue.slice(11, 16));
  const [slots, setSlots] = useState<Slot[] | null>(null);

  useEffect(() => {
    if (!serviceId || date.length !== 10) return setSlots(null);
    let cancelled = false;
    fetch(`/api/slots?date=${date}&service=${serviceId}${staffId ? `&staff=${staffId}` : ""}`)
      .then((r) => r.json())
      .then((data) => !cancelled && setSlots(data.slots ?? []))
      .catch(() => !cancelled && setSlots(null));
    return () => {
      cancelled = true;
    };
  }, [date, serviceId, staffId]);

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={date && time ? `${date}T${time}` : ""} />
      <div className="flex gap-2">
        <input type="date" id={name} required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} aria-label="Date" />
        <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={`${inputClass} w-36`} aria-label="Time" />
      </div>
      {slots && (
        <div>
          <p className="mb-1.5 text-xs text-slate-500">
            {slots.length ? "Free times that day:" : "No free times in working hours that day. You can still enter a time manually."}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {slots.map((s) => {
              const t = s.local.slice(11, 16);
              return (
                <button
                  type="button"
                  key={s.local}
                  onClick={() => setTime(t)}
                  aria-pressed={time === t}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition",
                    time === t
                      ? "border-[#2B6F6F] bg-[#2B6F6F] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-[#43A3A3]",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
