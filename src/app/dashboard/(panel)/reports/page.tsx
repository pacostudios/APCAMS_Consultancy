import { CalendarDays, DollarSign, Download, TrendingDown, UserPlus } from "lucide-react";
import { BOOKING_STATUSES } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { formatAUD } from "@/lib/format";
import { Card, EmptyState, FilterTabs, PageHeader, StatTile, StatusBadge, Table, bookingStatusLabel, buttonClass, tdClass } from "../_components/ui";
import { BarList, ColumnChart } from "./_components/charts";
import { RANGES, buildReport, monthlyTrend, type RangeKey } from "./_lib/report";

export const dynamic = "force-dynamic";

const monthLabel = (m: string, withYear = false) =>
  new Date(`${m}-15T00:00:00Z`).toLocaleDateString("en-AU", { month: "short", ...(withYear ? { year: "numeric" } : {}), timeZone: "UTC" });

const compactAUD = (cents: number) => {
  const dollars = cents / 100;
  return dollars >= 1000 ? `$${(dollars / 1000).toFixed(dollars >= 10000 ? 0 : 1)}k` : `$${Math.round(dollars)}`;
};

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const range: RangeKey = sp.range && sp.range in RANGES ? (sp.range as RangeKey) : "this_month";

  const report = buildReport(range);
  const trend = monthlyTrend();

  return (
    <>
      <PageHeader
        title="Reports"
        description="Revenue counts bookings marked paid. Bookings are grouped by appointment date."
        actions={
          <a href={`/dashboard/reports/export?range=${range}`} className={buttonClass.secondary}>
            <Download size={16} /> Export CSV
          </a>
        }
      />

      <div className="mb-6">
        <FilterTabs
          param="range"
          current={range}
          searchParams={sp}
          basePath="/dashboard/reports"
          options={Object.entries(RANGES).map(([value, label]) => ({ value, label }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Revenue" value={formatAUD(report.revenue)} hint={`Avg ${formatAUD(report.avgValue)} per paid booking`} icon={<DollarSign size={18} />} />
        <StatTile label="Bookings" value={String(report.total)} hint={`${report.byStatus.completed} completed`} icon={<CalendarDays size={18} />} />
        <StatTile label="Cancelled or no-show" value={`${Math.round(report.lostRate * 100)}%`} hint={`${report.byStatus.cancelled + report.byStatus.no_show} of ${report.total} bookings`} icon={<TrendingDown size={18} />} />
        <StatTile label="New clients" value={String(report.newClients)} hint={RANGES[range]} icon={<UserPlus size={18} />} />
      </div>

      <Card title="Revenue by month · last 12 months" className="mt-6">
        <ColumnChart
          formatValue={compactAUD}
          data={trend.map((t) => ({
            label: monthLabel(t.month),
            value: t.revenue,
            tooltip: `${monthLabel(t.month, true)}: ${formatAUD(t.revenue)} · ${t.bookings} bookings`,
          }))}
        />
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-[#2B6F6F]">Show as table</summary>
          <div className="mt-3">
            <Table head={["Month", "Bookings", "Revenue"]}>
              {trend.map((t) => (
                <tr key={t.month}>
                  <td className={tdClass}>{monthLabel(t.month, true)}</td>
                  <td className={`${tdClass} tabular-nums`}>{t.bookings}</td>
                  <td className={`${tdClass} tabular-nums`}>{formatAUD(t.revenue)}</td>
                </tr>
              ))}
            </Table>
          </div>
        </details>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title={`Revenue by service · ${RANGES[range].toLowerCase()}`}>
          {report.byService.length ? (
            <>
              <BarList
                formatValue={formatAUD}
                data={report.byService.map((s) => ({
                  label: s.name,
                  value: s.revenue,
                  tooltip: `${s.name}: ${formatAUD(s.revenue)} from ${s.bookings} bookings`,
                }))}
              />
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-[#2B6F6F]">Show as table</summary>
                <div className="mt-3">
                  <Table head={["Service", "Bookings", "Revenue"]}>
                    {report.byService.map((s) => (
                      <tr key={s.name}>
                        <td className={tdClass}>{s.name}</td>
                        <td className={`${tdClass} tabular-nums`}>{s.bookings}</td>
                        <td className={`${tdClass} tabular-nums`}>{formatAUD(s.revenue)}</td>
                      </tr>
                    ))}
                  </Table>
                </div>
              </details>
            </>
          ) : (
            <EmptyState message="No bookings in this period." />
          )}
        </Card>

        <Card title={`Bookings by status · ${RANGES[range].toLowerCase()}`}>
          {report.total ? (
            <Table head={["Status", "Bookings", "Share"]}>
              {BOOKING_STATUSES.map((s) => (
                <tr key={s}>
                  <td className={tdClass}><StatusBadge status={s} /></td>
                  <td className={`${tdClass} tabular-nums`}>{report.byStatus[s]}</td>
                  <td className={`${tdClass} tabular-nums text-slate-500`} aria-label={`${bookingStatusLabel(s)} share`}>
                    {Math.round((report.byStatus[s] / report.total) * 100)}%
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyState message="No bookings in this period." />
          )}
        </Card>
      </div>
    </>
  );
}
