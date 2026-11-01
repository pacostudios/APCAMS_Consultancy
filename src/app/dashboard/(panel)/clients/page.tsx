import Link from "next/link";
import { count, desc, eq, like, max, or, sql } from "drizzle-orm";
import { Search } from "lucide-react";
import { db } from "@/db";
import { booking, client } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { formatAUD, formatDate } from "@/lib/format";
import { Card, EmptyState, PageHeader, Table, buttonClass, inputClass, tdClass } from "../_components/ui";

export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const q = (await searchParams).q?.trim() ?? "";

  const rows = db
    .select({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
      bookings: count(booking.id),
      lastBooking: max(booking.startsAt),
      paidCents: sql<number>`coalesce(sum(case when ${booking.paymentStatus} = 'paid' then ${booking.priceCents} end), 0)`,
    })
    .from(client)
    .leftJoin(booking, eq(booking.clientId, client.id))
    .where(q ? or(like(client.name, `%${q}%`), like(client.email, `%${q}%`), like(client.phone, `%${q}%`)) : undefined)
    .groupBy(client.id)
    .orderBy(desc(max(booking.startsAt)), desc(client.createdAt))
    .all();

  return (
    <>
      <PageHeader
        title="Clients"
        description={`${rows.length} client${rows.length === 1 ? "" : "s"}${q ? ` matching “${q}”` : ""}`}
        actions={<Link href="/dashboard/clients/new" className={buttonClass.primary}>Add client</Link>}
      />

      <form className="mb-4 flex gap-2" action="/dashboard/clients">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={q} placeholder="Search name, email, phone…" className={`${inputClass} w-72 pl-9`} aria-label="Search clients" />
        </div>
        <button className={buttonClass.secondary}>Search</button>
      </form>

      <Card>
        {rows.length ? (
          <div className="-mx-5 -my-5">
            <Table head={["Client", "Contact", "Bookings", "Last booking", "Total paid", ""]}>
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className={`${tdClass} font-medium text-slate-900`}>{c.name}</td>
                  <td className={tdClass}>
                    <div>{c.email ?? "—"}</div>
                    <div className="text-xs text-slate-500">{c.phone}</div>
                  </td>
                  <td className={`${tdClass} tabular-nums`}>{c.bookings}</td>
                  <td className={tdClass}>{c.lastBooking ? formatDate(new Date(c.lastBooking)) : "—"}</td>
                  <td className={`${tdClass} tabular-nums`}>{formatAUD(Number(c.paidCents))}</td>
                  <td className={`${tdClass} text-right`}>
                    <Link href={`/dashboard/clients/${c.id}`} className="text-sm font-medium text-[#2B6F6F] hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        ) : (
          <EmptyState message={q ? "No clients match your search." : "No clients yet. They're added automatically when someone books."} />
        )}
      </Card>
    </>
  );
}
