import { Grid2X2, Map } from "lucide-react";
import { PropertyFilters } from "../components/property/PropertyFilters";
import { PropertyGrid } from "../components/property/PropertyGrid";
import { Button } from "../components/ui/Button";
import { usePropertySearch } from "../hooks/usePropertyRegistry";
import { useAppStore } from "../store/useAppStore";

export function BrowsePage() {
  const { filters, mapView, setMapView } = useAppStore();
  const { data, isLoading, error } = usePropertySearch({ ...filters, limit: 12 });
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <PropertyFilters />
      <section className="space-y-4">
        <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Browse Properties</h1><Button className="bg-white/10 text-white" onClick={() => setMapView(!mapView)}>{mapView ? <Grid2X2 /> : <Map />} Toggle</Button></div>
        {isLoading && <div className="rounded bg-white/10 p-8">Loading listings...</div>}
        {error && <div className="rounded bg-error/10 p-4 text-error">Could not load listings.</div>}
        {mapView ? <div className="min-h-[420px] rounded border border-white/10 bg-surface p-4">Map view</div> : <PropertyGrid properties={data?.items || []} />}
      </section>
    </div>
  );
}
