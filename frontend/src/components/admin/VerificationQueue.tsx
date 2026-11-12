import { BadgeCheck, ShieldQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import { usePropertySearch } from "../../hooks/usePropertyRegistry";
import { propertyTitle } from "../../lib/visuals";
import { AddressBadge } from "../common/AddressBadge";
import { EmptyState } from "../common/EmptyState";
import { EthAmount } from "../common/EthAmount";
import { Button } from "../ui/Button";
import { Card, CardTitle } from "../ui/Card";

/** Unverified active listings, read from the public listing endpoint. */
export function VerificationQueue() {
  const { data } = usePropertySearch({ limit: 50, status: "Active" });
  const pending = (data?.items ?? []).filter((item) => !item.verified);

  return (
    <Card>
      <CardTitle icon={<ShieldQuestion className="h-4 w-4" />} action={<span className="rounded-full bg-gold/10 px-3 py-1 font-mono text-[11px] text-gold-soft">{pending.length} pending</span>}>
        Verification queue
      </CardTitle>
      {pending.length === 0 ? (
        <EmptyState icon={<BadgeCheck className="h-6 w-6" />} title="All caught up" hint="Every active listing has been verified." />
      ) : (
        <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {pending.map((item) => (
            <li key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[.06] bg-white/[.02] px-4 py-3 transition hover:border-white/15">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-slate-500">#{item.propertyId}</span>
                <Link to={`/property/${item._id}`} className="font-medium text-white hover:text-accent-soft">
                  {propertyTitle(item)}
                </Link>
                <EthAmount value={item.priceWei} className="hidden text-sm sm:inline-flex" />
              </div>
              <div className="flex items-center gap-3">
                <AddressBadge address={item.owner} className="hidden md:inline-flex" />
                <Button size="sm">Verify</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
