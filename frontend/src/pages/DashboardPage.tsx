import { Card } from "../components/ui/Card";

const tabs = ["My Listings", "My Purchases", "My Rentals", "My NFT Deeds", "Transactions"];

export function DashboardPage() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Dashboard</h1><div className="flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab} className="rounded bg-surface px-3 py-2 text-sm">{tab}</button>)}</div><Card><p className="text-muted">Wallet portfolio and indexed contract activity.</p></Card></div>;
}
