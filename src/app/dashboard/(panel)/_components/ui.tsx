import Link from "next/link";
import type { ReactNode } from "react";
import { Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingStatus, PaymentStatus } from "@/db/schema";

/* Shared admin UI primitives. Teal brand: #2B6F6F (dark) / #43A3A3 (primary). */

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#43A3A3] focus:outline-none focus:ring-2 focus:ring-[#43A3A3]/30 disabled:bg-slate-50";

export const buttonClass = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B6F6F] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#245d5d] disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-[#2B6F6F] hover:bg-[#2B6F6F]/10",
};

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, actions, children, className }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatTile({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="rounded-lg bg-[#43A3A3]/10 p-2 text-[#2B6F6F]">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Field({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-sm text-slate-500">{message}</p>
      {action}
    </div>
  );
}

/* Status badges always carry a text label, never colour alone. */

const bookingStatusStyle: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-sky-50 text-sky-800 ring-sky-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600 ring-slate-200" },
  no_show: { label: "No-show", className: "bg-red-50 text-red-700 ring-red-200" },
};

const paymentStatusStyle: Record<PaymentStatus, { label: string; className: string }> = {
  unpaid: { label: "Unpaid", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  refunded: { label: "Refunded", className: "bg-slate-100 text-slate-600 ring-slate-200" },
};

const badgeBase = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap";

export const bookingStatusLabel = (s: BookingStatus) => bookingStatusStyle[s].label;
export const paymentStatusLabel = (s: PaymentStatus) => paymentStatusStyle[s].label;

export function StatusBadge({ status }: { status: BookingStatus }) {
  const s = bookingStatusStyle[status];
  return <span className={cn(badgeBase, s.className)}>{s.label}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const s = paymentStatusStyle[status];
  return <span className={cn(badgeBase, s.className)}>{s.label}</span>;
}

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export const tdClass = "whitespace-nowrap px-4 py-3 text-slate-700";

/** Pill-style filter links that keep other query params. */
export function FilterTabs({ options, current, param, searchParams, basePath }: {
  options: { value: string; label: string }[];
  current: string;
  param: string;
  searchParams: Record<string, string | undefined>;
  basePath: string;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
      {options.map((o) => {
        const params = new URLSearchParams(Object.entries(searchParams).filter(([, v]) => v) as [string, string][]);
        params.set(param, o.value);
        params.delete("page");
        return (
          <Link
            key={o.value}
            href={`${basePath}?${params}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition",
              current === o.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900",
            )}
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * "Join" link for an active booking's meeting, shown until the session ends.
 * Opening the link while signed in to the host's Zoom account starts the meeting as host.
 */
export function JoinMeetingButton({
  booking: b,
  size = "md",
}: {
  booking: { meetingUrl: string | null; status: BookingStatus; endsAt: Date };
  size?: "sm" | "md";
}) {
  const active = b.status === "pending" || b.status === "confirmed";
  if (!b.meetingUrl || !active || b.endsAt < new Date()) return null;
  return (
    <a
      href={b.meetingUrl}
      target="_blank"
      rel="noreferrer"
      className={
        size === "sm"
          ? "inline-flex items-center gap-1 rounded-md bg-[#2B6F6F] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#245d5d]"
          : buttonClass.primary
      }
    >
      <Video size={size === "sm" ? 12 : 16} /> {size === "sm" ? "Join" : "Join meeting"}
    </a>
  );
}
