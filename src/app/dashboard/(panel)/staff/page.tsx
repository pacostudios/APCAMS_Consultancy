import Link from "next/link";
import { and, count, gte, inArray } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db";
import { booking, service } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { listStaff } from "@/lib/staff";
import { Card, EmptyState, PageHeader, Table, buttonClass, tdClass } from "../_components/ui";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  await requireAdmin();
  const members = listStaff();
  const services = new Map(db.select({ id: service.id, name: service.name }).from(service).all().map((s) => [s.id, s.name]));
  const upcoming = new Map(
    db
      .select({ staffId: booking.staffId, n: count() })
      .from(booking)
      .where(and(inArray(booking.status, ["pending", "confirmed"]), gte(booking.startsAt, new Date())))
      .groupBy(booking.staffId)
      .all()
      .map((r) => [r.staffId, r.n]),
  );

  return (
    <>
      <PageHeader
        title="Staff"
        description="Practitioners, the services they provide and their sign-ins. Online bookings go to whoever provides the service and is free."
        actions={<Link href="/dashboard/staff/new" className={buttonClass.primary}><Plus size={16} /> Add staff</Link>}
      />
      <Card>
        {members.length ? (
          <Table head={["Name", "Services", "Upcoming", "Status", ""]}>
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className={tdClass}>
                  <Link href={`/dashboard/staff/${m.id}`} className="font-medium text-slate-900 hover:text-[#2B6F6F] hover:underline">{m.name}</Link>
                  <div className="text-xs text-slate-500">{m.title ? `${m.title} · ` : ""}{m.email}</div>
                </td>
                <td className={`${tdClass} whitespace-normal`}>
                  {m.serviceIds.length ? (
                    <div className="flex max-w-md flex-wrap gap-1">
                      {m.serviceIds.map((id) => (
                        <span key={id} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">{services.get(id)}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-amber-700">None: can&apos;t be booked</span>
                  )}
                </td>
                <td className={`${tdClass} tabular-nums`}>{upcoming.get(m.id) ?? 0}</td>
                <td className={tdClass}>
                  <span className={m.active ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800" : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"}>
                    {m.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className={`${tdClass} text-right`}>
                  <Link href={`/dashboard/staff/${m.id}`} className="text-sm font-medium text-[#2B6F6F] hover:underline">Manage</Link>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState
            message="No staff yet. Clients can't book online until at least one staff member provides a service."
            action={<Link href="/dashboard/staff/new" className={buttonClass.primary}>Add staff</Link>}
          />
        )}
      </Card>
    </>
  );
}
