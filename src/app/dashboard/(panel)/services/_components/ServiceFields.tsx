"use client";

import { useState } from "react";
import type { Service } from "@/db/schema";
import { Field, inputClass } from "../../_components/ui";

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function ServiceFields({ service }: { service?: Service }) {
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(service));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            required
            defaultValue={service?.name}
            onChange={(e) => !slugEdited && setSlug(slugify(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="URL slug" htmlFor="slug" hint={`Page address: /service/${slug || "…"}`}>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Price (AUD, incl. GST)" htmlFor="price">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={service ? (service.priceCents / 100).toFixed(2) : ""}
              className={`${inputClass} pl-7`}
            />
          </div>
        </Field>
        <Field label="Duration (minutes)" htmlFor="durationMins" hint="Also sets the length of each bookable slot.">
          <input id="durationMins" name="durationMins" type="number" min="15" max="480" step="5" required defaultValue={service?.durationMins ?? 60} className={inputClass} />
        </Field>
        <Field label="Display order" htmlFor="sortOrder" hint="Lower numbers show first.">
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={service?.sortOrder ?? 0} className={inputClass} />
        </Field>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" name="active" defaultChecked={service?.active ?? true} className="h-4 w-4 rounded border-slate-300 accent-[#2B6F6F]" />
            Active (bookable on the website)
          </label>
        </div>
      </div>
      <Field label="Short summary" htmlFor="summary">
        <textarea id="summary" name="summary" rows={3} defaultValue={service?.summary ?? ""} className={inputClass} />
      </Field>
    </div>
  );
}
