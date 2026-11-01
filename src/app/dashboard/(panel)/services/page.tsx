import Link from "next/link";
import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { booking, service } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { formatAUD } from "@/lib/format";
import { SubmitButton } from "../_components/ActionForm";
import { Card, EmptyState, PageHeader, Table, buttonClass, tdClass } from "../_components/ui";
import { toggleServiceAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  await requireAdmin();

  const rows = db
    .select({
      id: service.id,
      name: service.name,
      slug: service.slug,
      priceCents: service.priceCents,
      durationMins: service.durationMins,
      active: service.active,
      bookings: count(booking.id),
    })
    .from(service)
    .leftJoin(booking, eq(booking.serviceId, service.id))
    .groupBy(service.id)
    .orderBy(asc(service.sortOrder), asc(service.name))
    .all();

  return (
    <>
      <PageHeader
        title="Services"
        description="What clients can book, with pricing and session length."
        actions={<Link href="/dashboard/services/new" className={buttonClass.primary}>Add service</Link>}
      />
      <Card>
        {rows.length ? (
          <div className="-mx-5 -my-5">
            <Table head={["Service", "Price", "Duration", "Bookings", "Status", ""]}>
              {rows.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className={tdClass}>
                    <div className="font-medium text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">/service/{s.slug}</div>
                  </td>
                  <td className={`${tdClass} tabular-nums`}>{formatAUD(s.priceCents)}</td>
                  <td className={tdClass}>{s.durationMins} min</td>
                  <td className={`${tdClass} tabular-nums`}>{s.bookings}</td>
                  <td className={tdClass}>
                    <form action={toggleServiceAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <SubmitButton variant="ghost" className={s.active ? "text-emerald-700" : "text-slate-500"}>
                        {s.active ? "● Active" : "○ Hidden"}
                      </SubmitButton>
                    </form>
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <Link href={`/dashboard/services/${s.id}`} className="text-sm font-medium text-[#2B6F6F] hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        ) : (
          <EmptyState message="No services yet." action={<Link href="/dashboard/services/new" className={buttonClass.primary}>Add service</Link>} />
        )}
      </Card>
    </>
  );
}
