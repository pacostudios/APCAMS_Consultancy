import type { Client } from "@/db/schema";
import { Field, inputClass } from "../../_components/ui";

export default function ClientFields({ client }: { client?: Client }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name">
          <input id="name" name="name" required defaultValue={client?.name} className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" defaultValue={client?.email ?? ""} className={inputClass} />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input id="phone" name="phone" type="tel" placeholder="04xx xxx xxx" defaultValue={client?.phone ?? ""} className={inputClass} />
        </Field>
        <Field label="Address / suburb" htmlFor="address">
          <input id="address" name="address" defaultValue={client?.address ?? ""} className={inputClass} />
        </Field>
      </div>
      <Field label="Private notes" htmlFor="notes" hint="Only visible to admins.">
        <textarea id="notes" name="notes" rows={4} defaultValue={client?.notes ?? ""} className={inputClass} />
      </Field>
    </div>
  );
}
