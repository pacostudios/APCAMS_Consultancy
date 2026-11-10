import Link from "next/link";
import { and, count, eq, gte, like, lt, or, type SQL } from "drizzle-orm";
import { Search } from "lucide-react";
import { db } from "@/db";
import { BOOKING_STATUSES, booking, client, type BookingStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { listBookings } from "../_lib/queries";
import BookingTable from "../_components/BookingTable";
import { bookingStatusLabel, buttonClass, Card, EmptyState, FilterTabs, inputClass, PageHeader } from "../_components/ui";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type Params = { view?: string; status?: string; q?: string; page?: string };

export default async function BookingsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireAdmin();
  const sp = await searchParams;
  const view = sp.view === "past" || sp.view === "all" ? sp.view : "upcoming";
  const status = (BOOKING_STATUSES as readonly string[]).includes(sp.status ?? "") ? (sp.status as BookingStatus) : "all";
  const q = sp.q?.trim() ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

  const now = new Date();
  const filters: (SQL | undefined)[] = [
    view === "upcoming" ? gte(booking.startsAt, now) : view === "past" ? lt(booking.startsAt, now) : undefined,
    status !== "all" ? eq(booking.status, status) : undefined,
    q
      ? or(
          like(client.name, `%${q}%`),
          like(client.email, `%${q}%`),
          like(client.phone, `%${q}%`),
          like(booking.reference, `%${q.toUpperCase()}%`),
        )
      : undefined,
  ];
  const where = and(...filters);

  const [{ total }] = db
    .select({ total: count() })
    .from(booking)
    .innerJoin(client, eq(booking.clientId, client.id))
    .where(where)
    .all();
  const rows = listBookings({
    where,
    order: view === "upcoming" ? "asc" : "desc",
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageLink = (p: number) => {
    const params = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]);
    params.set("page", String(p));
    return `/dashboard/bookings?${params}`;
  };

  return (
    <>
      <PageHeader
        title="Bookings"
        description={`${total} booking${total === 1 ? "" : "s"}`}
        actions={<Link href="/dashboard/bookings/new" className={buttonClass.primary}>New booking</Link>}
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          param="view"
          current={view}
          searchParams={sp}
          basePath="/dashboard/bookings"
          options={[
            { value: "upcoming", label: "Upcoming" },
            { value: "past", label: "Past" },
            { value: "all", label: "All" },
          ]}
        />
        <form className="flex flex-wrap gap-2" action="/dashboard/bookings">
          <input type="hidden" name="view" value={view} />
          <select name="status" defaultValue={status} className={`${inputClass} w-auto`} aria-label="Status">
            <option value="all">All statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>{bookingStatusLabel(s)}</option>
            ))}
          </select>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="q" defaultValue={q} placeholder="Name, email, phone, ref…" className={`${inputClass} w-64 pl-9`} aria-label="Search" />
          </div>
          <button className={buttonClass.secondary}>Filter</button>
        </form>
      </div>

      <Card>
        {rows.length ? (
          <div className="-mx-5 -my-5"><BookingTable rows={rows} /></div>
        ) : (
          <EmptyState message="No bookings match these filters." />
        )}
      </Card>

      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-sm text-slate-600" aria-label="Pagination">
          <span>Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={pageLink(page - 1)} className={buttonClass.secondary}>Previous</Link>}
            {page < pages && <Link href={pageLink(page + 1)} className={buttonClass.secondary}>Next</Link>}
          </div>
        </nav>
      )}
    </>
  );
}
