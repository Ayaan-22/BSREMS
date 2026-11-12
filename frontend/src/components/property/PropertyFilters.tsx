import { BadgeCheck, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";
import { STATUS_STYLES } from "../../lib/visuals";
import { useAppStore } from "../../store/useAppStore";
import type { PropertyStatus } from "../../types/property";

const STATUSES: PropertyStatus[] = ["Active", "UnderContract", "Sold", "Delisted"];

export function PropertyFilters() {
  const { filters, setFilter } = useAppStore();
  return (
    <aside className="glass h-fit space-y-7 rounded-2xl p-5 lg:sticky lg:top-28">
      <p className="flex items-center gap-2 text-sm font-semibold text-white">
        <SlidersHorizontal className="h-4 w-4 text-accent-soft" /> Filters
      </p>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input className="field pl-11" placeholder="Search city, title, CID" value={filters.search} onChange={(event) => setFilter("search", event.target.value)} />
      </label>

      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Status</p>
        <div className="grid gap-1.5">
          {STATUSES.map((status) => {
            const active = filters.status === status;
            return (
              <button
                key={status}
                onClick={() => setFilter("status", status)}
                className={cn(
                  "focus-ring flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all",
                  active ? "border-accent/40 bg-accent/10 text-white" : "border-transparent text-slate-400 hover:bg-white/[.04] hover:text-white"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span className={cn("h-2 w-2 rounded-full", STATUS_STYLES[status].dot)} />
                  {STATUS_STYLES[status].label}
                </span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(45,212,191,.6)]" />}
              </button>
            );
          })}
        </div>
      </div>

      <button
        role="switch"
        aria-checked={filters.verifiedOnly}
        onClick={() => setFilter("verifiedOnly", !filters.verifiedOnly)}
        className="focus-ring flex w-full items-center justify-between rounded-xl border border-white/[.07] bg-white/[.02] px-3.5 py-3 text-sm text-slate-200"
      >
        <span className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-success" /> Verified only
        </span>
        <span className={cn("relative h-6 w-11 rounded-full transition-colors duration-300", filters.verifiedOnly ? "bg-accent" : "bg-white/10")}>
          <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-300", filters.verifiedOnly ? "left-6" : "left-1")} />
        </span>
      </button>
    </aside>
  );
}
