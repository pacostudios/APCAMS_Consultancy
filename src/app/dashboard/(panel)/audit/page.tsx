import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { auditLog } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { listStaff } from "@/lib/staff";
import AuditList from "../_components/AuditList";
import { Card, FilterTabs, PageHeader, buttonClass, inputClass } from "../_components/ui";
import { listAudit } from "../_lib/queries";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;
const WHO = [
  { value: "all", label: "Everyone" },
  { value: "admin", label: "Admins" },
  { value: "staff", label: "Staff" },
  { value: "client", label: "Clients" },
  { value: "system", label: "System" },
] as const;

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ who?: string; staff?: string; page?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const who = WHO.find((w) => w.value === params.who)?.value ?? "all";
  const staffId = Number(params.staff) || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const rows = listAudit({
    where: and(who === "all" ? undefined : eq(auditLog.actorRole, who), staffId ? eq(auditLog.staffId, staffId) : undefined),
    limit: PAGE_SIZE + 1,
    offset: (page - 1) * PAGE_SIZE,
  });
  const hasMore = rows.length > PAGE_SIZE;
  const staff = listStaff();
  const pageHref = (p: number) => `/dashboard/audit?${new URLSearchParams({ who, ...(staffId ? { staff: String(staffId) } : {}), page: String(p) })}`;

  return (
    <>
      <PageHeader title="Audit log" description="Every booking change, reschedule and cancellation, and every change to staff, with who made it." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterTabs options={[...WHO]} current={who} param="who" searchParams={params} basePath="/dashboard/audit" />
        <form className="flex items-center gap-2">
          <input type="hidden" name="who" value={who} />
          <select name="staff" defaultValue={staffId ?? ""} className={`${inputClass} w-56`} aria-label="Staff member">
            <option value="">All staff</option>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button className={buttonClass.secondary}>Filter</button>
        </form>
      </div>
      <Card>
        <AuditList rows={rows.slice(0, PAGE_SIZE)} linkBookings />
        {(page > 1 || hasMore) && (
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
            {page > 1 ? <Link href={pageHref(page - 1)} className={buttonClass.secondary}>Newer</Link> : <span />}
            {hasMore && <Link href={pageHref(page + 1)} className={buttonClass.secondary}>Older</Link>}
          </div>
        )}
      </Card>
    </>
  );
}
