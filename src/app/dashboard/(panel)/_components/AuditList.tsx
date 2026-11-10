import Link from "next/link";
import type { AuditEntry } from "@/db/schema";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "./ui";

const ROLE_STYLE: Record<AuditEntry["actorRole"], string> = {
  admin: "bg-[#43A3A3]/15 text-[#2B6F6F]",
  staff: "bg-violet-100 text-violet-700",
  client: "bg-sky-100 text-sky-700",
  system: "bg-slate-100 text-slate-600",
};

/** A timeline of audit entries, newest first. `linkBookings` adds a link to each entry's booking. */
export default function AuditList({ rows, linkBookings = false }: { rows: AuditEntry[]; linkBookings?: boolean }) {
  if (rows.length === 0) return <EmptyState message="Nothing recorded yet." />;
  return (
    <ol className="divide-y divide-slate-100">
      {rows.map((e) => (
        <li key={e.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
          <time className="w-40 shrink-0 text-xs tabular-nums text-slate-500 sm:pt-0.5" dateTime={e.createdAt.toISOString()}>
            {formatDateTime(e.createdAt)}
          </time>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-900">{e.summary}</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span className={cn("rounded px-1.5 py-0.5 font-semibold uppercase tracking-wide", ROLE_STYLE[e.actorRole])}>{e.actorRole}</span>
              {e.actorName}
              {linkBookings && e.bookingId && (
                <Link href={`/dashboard/bookings/${e.bookingId}`} className="font-medium text-[#2B6F6F] hover:underline">
                  View booking
                </Link>
              )}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
