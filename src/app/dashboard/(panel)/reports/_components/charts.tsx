/*
 * Minimal, dependency-free charts rendered on the server.
 * Single series, one teal hue, so no legend needed: the card title names it.
 * Thin bars with rounded data-ends, a 2px gap between bars, recessive grid,
 * hover/focus tooltip on every bar, and a table view alongside.
 */

const BAR = "#2B8A8A"; // brand teal, readable on white
const BAR_HOVER = "#1F6666";

type Datum = { label: string; value: number; tooltip: string };

function niceMax(max: number) {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= max / 4)! * pow;
  return Math.ceil(max / step) * step;
}

/** Vertical bars over time. */
export function ColumnChart({ data, formatValue, height = 220 }: {
  data: Datum[];
  formatValue: (v: number) => string;
  height?: number;
}) {
  const top = niceMax(Math.max(...data.map((d) => d.value)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * top);
  const lastNonZero = data.findLastIndex((d) => d.value > 0);

  return (
    <div className="flex gap-3" role="img" aria-label="Column chart; see the table view for values">
      {/* y-axis */}
      <div className="relative w-14 shrink-0 text-right text-[11px] tabular-nums text-slate-400" style={{ height }}>
        {ticks.map((t) => (
          <span key={t} className="absolute right-0" style={{ bottom: `${(t / top) * 100}%`, transform: "translateY(50%)" }}>
            {formatValue(t)}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative" style={{ height }}>
          {/* grid */}
          {ticks.map((t) => (
            <div key={t} className={`absolute inset-x-0 border-t ${t === 0 ? "border-slate-300" : "border-slate-100"}`} style={{ bottom: `${(t / top) * 100}%` }} />
          ))}
          {/* bars */}
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {data.map((d, i) => (
              <div key={d.label} tabIndex={0} className="group relative flex h-full flex-1 items-end justify-center outline-none">
                <div
                  className="w-full max-w-10 rounded-t transition-colors group-hover:[background:var(--hover)] group-focus:[background:var(--hover)]"
                  style={{ height: `${(d.value / top) * 100}%`, minHeight: d.value > 0 ? 2 : 0, background: BAR, ["--hover" as string]: BAR_HOVER }}
                />
                {/* selective direct label: latest period only */}
                {i === lastNonZero && (
                  <span className="pointer-events-none absolute text-[11px] font-semibold tabular-nums text-slate-700 group-hover:hidden" style={{ bottom: `calc(${(d.value / top) * 100}% + 4px)` }}>
                    {formatValue(d.value)}
                  </span>
                )}
                {/* tooltip */}
                <div className="pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg group-hover:block group-focus:block">
                  {d.tooltip}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* x-axis */}
        <div className="mt-2 flex gap-[2px]">
          {data.map((d) => (
            <span key={d.label} className="flex-1 truncate text-center text-[11px] text-slate-500">{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Horizontal bars for comparing categories (sorted by the caller). */
export function BarList({ data, formatValue }: { data: Datum[]; formatValue: (v: number) => string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="space-y-[2px]">
      {data.map((d) => (
        <li key={d.label} tabIndex={0} title={d.tooltip} className="group grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 rounded py-1.5 outline-none focus:bg-slate-50">
          <span className="truncate text-sm text-slate-700">{d.label}</span>
          <div className="h-3">
            <div
              className="h-full rounded-r transition-colors group-hover:[background:var(--hover)] group-focus:[background:var(--hover)]"
              style={{ width: `${(d.value / max) * 100}%`, minWidth: d.value > 0 ? 2 : 0, background: BAR, ["--hover" as string]: BAR_HOVER }}
            />
          </div>
          <span className="text-right text-sm font-medium tabular-nums text-slate-900">{formatValue(d.value)}</span>
        </li>
      ))}
    </ul>
  );
}
