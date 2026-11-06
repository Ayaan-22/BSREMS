import { Card } from "../ui/Card";

export function AdminDashboard() {
  return <Card><h2 className="mb-3 text-lg font-semibold">Platform Stats</h2><div className="grid gap-3 sm:grid-cols-4">{["Listings", "Volume", "Escrows", "Fees"].map((item) => <div key={item} className="rounded bg-background p-3"><p className="text-sm text-muted">{item}</p><p className="text-2xl font-bold">0</p></div>)}</div></Card>;
}
