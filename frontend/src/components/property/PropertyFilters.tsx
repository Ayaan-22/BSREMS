import { useAppStore } from "../../store/useAppStore";

export function PropertyFilters() {
  const { filters, setFilter } = useAppStore();
  return (
    <aside className="space-y-4 rounded border border-white/10 bg-surface p-4">
      <input className="w-full rounded bg-background px-3 py-2" placeholder="Search city, title, CID" value={filters.search} onChange={(event) => setFilter("search", event.target.value)} />
      <select className="w-full rounded bg-background px-3 py-2" value={filters.status} onChange={(event) => setFilter("status", event.target.value)}>
        <option>Active</option>
        <option>UnderContract</option>
        <option>Sold</option>
        <option>Delisted</option>
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={filters.verifiedOnly} onChange={(event) => setFilter("verifiedOnly", event.target.checked)} />
        Verified only
      </label>
    </aside>
  );
}
