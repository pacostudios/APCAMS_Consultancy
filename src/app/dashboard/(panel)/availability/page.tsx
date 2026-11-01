import { asc, gte } from "drizzle-orm";
import { X } from "lucide-react";
import { db } from "@/db";
import { availability, blockedDate } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { formatDate, startOfBusinessDay, toDateKey, zoneLabel } from "@/lib/format";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card, EmptyState, Field, PageHeader, inputClass } from "../_components/ui";
import { addBlockedDateAction, removeBlockedDateAction } from "./actions";
import HoursEditor from "./_components/HoursEditor";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  await requireAdmin();
  const today = toDateKey(new Date());

  const hours = db.select({ weekday: availability.weekday, startTime: availability.startTime, endTime: availability.endTime })
    .from(availability).orderBy(asc(availability.weekday), asc(availability.startTime)).all();
  const blocked = db.select().from(blockedDate).where(gte(blockedDate.date, today)).orderBy(asc(blockedDate.date)).all();

  return (
    <>
      <PageHeader
        title="Availability"
        description={`When clients can book online. All times are ${zoneLabel()}.`}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card title="Weekly hours" className="xl:col-span-3">
          <HoursEditor initial={hours} />
        </Card>

        <div className="space-y-6 xl:col-span-2">
          <Card title="Close a day">
            <ActionForm action={addBlockedDateAction} resetOnSuccess className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date" htmlFor="date">
                  <input id="date" name="date" type="date" min={today} required className={inputClass} />
                </Field>
                <Field label="Reason (optional)" htmlFor="reason">
                  <input id="reason" name="reason" placeholder="e.g. Public holiday" className={inputClass} />
                </Field>
              </div>
              <div className="flex justify-end"><SubmitButton>Close day</SubmitButton></div>
            </ActionForm>
          </Card>

          <Card title="Upcoming closed days">
            {blocked.length ? (
              <ul className="divide-y divide-slate-100">
                {blocked.map((d) => (
                  <li key={d.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{formatDate(startOfBusinessDay(d.date))}</p>
                      {d.reason && <p className="text-xs text-slate-500">{d.reason}</p>}
                    </div>
                    <form action={removeBlockedDateAction}>
                      <input type="hidden" name="id" value={d.id} />
                      <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Reopen ${d.date}`}>
                        <X size={16} />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No closed days coming up." />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
