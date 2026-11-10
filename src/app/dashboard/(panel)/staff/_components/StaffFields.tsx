import { Field, inputClass } from "../../_components/ui";

type Defaults = { name?: string; email?: string; title?: string | null; phone?: string | null; serviceIds?: number[]; active?: boolean };

/** Profile fields shared by the add and edit staff forms. `withPassword` shows the initial password (add form only). */
export default function StaffFields({ services, defaults = {}, withPassword = false }: {
  services: { id: number; name: string; active: boolean }[];
  defaults?: Defaults;
  withPassword?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name">
          <input id="name" name="name" required defaultValue={defaults.name} className={inputClass} />
        </Field>
        <Field label="Job title (optional)" htmlFor="title">
          <input id="title" name="title" defaultValue={defaults.title ?? ""} placeholder="e.g. Clinical Psychologist" className={inputClass} />
        </Field>
        <Field label="Email (sign-in username)" htmlFor="email">
          <input id="email" name="email" type="email" required autoComplete="off" defaultValue={defaults.email} className={inputClass} />
        </Field>
        <Field label="Phone (optional)" htmlFor="phone">
          <input id="phone" name="phone" type="tel" defaultValue={defaults.phone ?? ""} placeholder="04xx xxx xxx" className={inputClass} />
        </Field>
        {withPassword && (
          <Field label="Password" htmlFor="password" hint="At least 8 characters. Hand it to them; you can set a new one later.">
            <input id="password" name="password" type="text" required minLength={8} autoComplete="new-password" className={inputClass} />
          </Field>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700">Services they provide</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {services.map((s) => (
            <label key={s.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <input type="checkbox" name="serviceIds" value={s.id} defaultChecked={defaults.serviceIds?.includes(s.id)} className="accent-[#2B6F6F]" />
              {s.name}
              {!s.active && <span className="text-xs text-slate-400">(inactive)</span>}
            </label>
          ))}
        </div>
      </fieldset>

      {defaults.active !== undefined && (
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input type="checkbox" name="active" defaultChecked={defaults.active} className="mt-0.5 accent-[#2B6F6F]" />
          <span>
            Active
            <span className="block text-xs text-slate-500">Inactive staff can&apos;t sign in and get no new bookings.</span>
          </span>
        </label>
      )}
    </div>
  );
}
