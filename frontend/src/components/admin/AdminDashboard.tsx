import { Activity, Building2, CircleDollarSign, Gavel } from "lucide-react";
import { formatEther } from "viem";
import { usePlatformStats, usePropertySearch } from "../../hooks/usePropertyRegistry";
import { CountUp } from "../common/CountUp";
import { Card, CardTitle } from "../ui/Card";

export function AdminDashboard() {
  const stats = usePlatformStats();
  const all = usePropertySearch({ limit: 50 });
  const listed = stats.data?.byStatus.reduce((sum, item) => sum + item.count, 0) ?? 0;
  const inEscrow = stats.data?.byStatus.find((item) => item._id === "UnderContract")?.count ?? 0;
  const value = Number(formatEther((all.data?.items ?? []).reduce((sum, item) => sum + BigInt(item.priceWei || "0"), 0n)));

  const tiles = [
    { label: "Listings", value: listed, icon: Building2, decimals: 0, suffix: "" },
    { label: "Listed value", value, icon: CircleDollarSign, decimals: 2, suffix: " ETH" },
    { label: "In escrow", value: inEscrow, icon: Gavel, decimals: 0, suffix: "" },
    { label: "Indexed events", value: stats.data?.transactionCount ?? 0, icon: Activity, decimals: 0, suffix: "" }
  ];

  return (
    <Card>
      <CardTitle icon={<Activity className="h-4 w-4" />} action={<span className="font-mono text-[11px] text-muted">live · refreshes every 15s</span>}>
        Platform stats
      </CardTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(({ label, value, icon: Icon, decimals, suffix }) => (
          <div key={label} className="rounded-2xl border border-white/[.06] bg-ink-950/40 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">{label}</p>
              <Icon className="h-4 w-4 text-accent-soft" />
            </div>
            <p className="mt-3 font-display text-4xl text-white">
              <CountUp value={value} decimals={decimals} suffix={suffix} />
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
