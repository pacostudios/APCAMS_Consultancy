"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ActionForm, SubmitButton, type ActionResult } from "../../_components/ActionForm";
import { buttonClass, inputClass } from "../../_components/ui";
import { saveHoursAction } from "../actions";

type Block = { weekday: number; startTime: string; endTime: string };

// Monday first, as Australians read a week.
const DAYS = [
  { n: 1, label: "Monday" }, { n: 2, label: "Tuesday" }, { n: 3, label: "Wednesday" },
  { n: 4, label: "Thursday" }, { n: 5, label: "Friday" }, { n: 6, label: "Saturday" }, { n: 0, label: "Sunday" },
];

/** Weekly hours editor. Saves the default business hours unless given another `action` (e.g. one staff member's hours). */
export default function HoursEditor({ initial, action = saveHoursAction, hidden = {}, submitLabel = "Save working hours" }: {
  initial: Block[];
  action?: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  hidden?: Record<string, string>;
  submitLabel?: string;
}) {
  const [blocks, setBlocks] = useState(initial);

  const update = (i: number, patch: Partial<Block>) => setBlocks((bs) => bs.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const remove = (i: number) => setBlocks((bs) => bs.filter((_, j) => j !== i));
  const add = (weekday: number) => {
    const last = blocks.filter((b) => b.weekday === weekday).at(-1);
    setBlocks((bs) => [...bs, last ? { weekday, startTime: last.endTime, endTime: "17:00" } : { weekday, startTime: "09:00", endTime: "17:00" }]);
  };

  return (
    <ActionForm action={action}>
      <input type="hidden" name="hours" value={JSON.stringify(blocks)} />
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <ul className="divide-y divide-slate-100">
        {DAYS.map((day) => {
          const dayBlocks = blocks.map((b, i) => ({ ...b, i })).filter((b) => b.weekday === day.n);
          return (
            <li key={day.n} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start">
              <div className="w-32 pt-2 text-sm font-medium text-slate-900">{day.label}</div>
              <div className="flex-1 space-y-2">
                {dayBlocks.length === 0 && <p className="pt-2 text-sm text-slate-400">Closed</p>}
                {dayBlocks.map((b) => (
                  <div key={b.i} className="flex items-center gap-2">
                    <input type="time" value={b.startTime} onChange={(e) => update(b.i, { startTime: e.target.value })}
                      className={`${inputClass} w-32`} aria-label={`${day.label} start`} required />
                    <span className="text-slate-400">to</span>
                    <input type="time" value={b.endTime} onChange={(e) => update(b.i, { endTime: e.target.value })}
                      className={`${inputClass} w-32`} aria-label={`${day.label} end`} required />
                    <button type="button" onClick={() => remove(b.i)} className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove block">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => add(day.n)} className={buttonClass.ghost}>
                <Plus size={14} /> {dayBlocks.length ? "Add break / block" : "Open this day"}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex justify-end"><SubmitButton>{submitLabel}</SubmitButton></div>
    </ActionForm>
  );
}
