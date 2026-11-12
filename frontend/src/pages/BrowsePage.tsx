import { Grid2X2, Map, MapPin } from "lucide-react";
import { PageHeader } from "../components/layout/PageWrapper";
import { PropertyFilters } from "../components/property/PropertyFilters";
import { PropertyGrid } from "../components/property/PropertyGrid";
import { usePropertySearch } from "../hooks/usePropertyRegistry";
import { cn } from "../lib/utils";
import { useAppStore } from "../store/useAppStore";

export function BrowsePage() {
  const { filters, mapView, setMapView } = useAppStore();
  const { data, isLoading, error } = usePropertySearch({ ...filters, limit: 12 });
  const total = data?.pagination?.total ?? data?.items.length ?? 0;

  return (
    <div>
      <PageHeader
        eyebrow="Marketplace"
        title={
          <>
            Browse <em className="text-gradient">properties</em>
          </>
        }
        description="Every listing below is indexed from PropertyRegistry events. Prices, owners and status come straight from the chain."
        actions={
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[.03] p-1">
            {[
              [false, Grid2X2, "Grid"],
              [true, Map, "Map"]
            ].map(([value, Icon, label]) => {
              const I = Icon as typeof Map;
              const active = mapView === value;
              return (
                <button
                  key={label as string}
                  onClick={() => setMapView(value as boolean)}
                  className={cn("focus-ring flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all", active ? "bg-white text-ink-950" : "text-slate-400 hover:text-white")}
                >
                  <I className="h-4 w-4" /> {label as string}
                </button>
              );
            })}
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <PropertyFilters />
        <section className="min-w-0 space-y-5">
          <div className="flex items-center justify-between font-mono text-xs text-muted">
            <span>
              <span className="text-white">{total}</span> {total === 1 ? "result" : "results"}
            </span>
            <span>Sorted by most recent activity</span>
          </div>
          {error && <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-sm text-red-200">Could not load listings. Is the API running on port 5000?</div>}
          {mapView ? <MapPlaceholder count={total} /> : <PropertyGrid properties={data?.items || []} loading={isLoading} />}
        </section>
      </div>
    </div>
  );
}

function MapPlaceholder({ count }: { count: number }) {
  const pins = Array.from({ length: Math.min(count, 12) }, (_, i) => ({ x: 12 + ((i * 37) % 76), y: 18 + ((i * 53) % 64) }));
  return (
    <div className="glass relative min-h-[520px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 grid-bg opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(45,212,191,.12),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(139,124,246,.12),transparent_45%)]" />
      {pins.map((pin, i) => (
        <span key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
          <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-ping2 rounded-full bg-accent/50" />
          <MapPin className="h-7 w-7 fill-accent/30 text-accent-soft drop-shadow-[0_0_12px_rgba(45,212,191,.8)]" />
        </span>
      ))}
      <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-ink-900/80 p-4 text-sm text-slate-300 backdrop-blur">
        Map view needs coordinates from IPFS metadata. Pins are illustrative until listings include <span className="font-mono text-accent-soft">location.coordinates</span>.
      </div>
    </div>
  );
}
