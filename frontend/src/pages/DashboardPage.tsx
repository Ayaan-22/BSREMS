import { useState } from "react";
import { Building2, FileKey2, Home, Receipt, ShoppingBag, Wallet } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { AddressAvatar } from "../components/common/AddressBadge";
import { EmptyState } from "../components/common/EmptyState";
import { EthAmount } from "../components/common/EthAmount";
import { PageHeader } from "../components/layout/PageWrapper";
import { Card } from "../components/ui/Card";
import { ConnectWallet } from "../components/wallet/ConnectWallet";
import { cn } from "../lib/utils";

const tabs = [
  { label: "My Listings", icon: Building2, hint: "Properties you have listed in the registry." },
  { label: "My Purchases", icon: ShoppingBag, hint: "Escrows where you are the buyer." },
  { label: "My Rentals", icon: Home, hint: "Rental agreements as tenant or landlord." },
  { label: "My NFT Deeds", icon: FileKey2, hint: "ERC-721 deeds held by this wallet." },
  { label: "Transactions", icon: Receipt, hint: "Indexed contract activity for this address." }
];

export function DashboardPage() {
  const [active, setActive] = useState(0);
  const { address, isConnected } = useAccount();
  const balance = useBalance({ address, query: { enabled: Boolean(address) } });
  const tab = tabs[active];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Portfolio" title={<>Your <em className="text-gradient">dashboard</em></>} description="Wallet portfolio and indexed contract activity." />

      <Card glow className="relative overflow-hidden !bg-ink-800/70 md:p-8">
        <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-[80px]" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {isConnected ? (
              <AddressAvatar address={address} className="h-16 w-16 ring-2" />
            ) : (
              <span className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/5 text-muted">
                <Wallet className="h-6 w-6" />
              </span>
            )}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{isConnected ? "Connected wallet" : "No wallet connected"}</p>
              <p className="mt-1 break-all font-mono text-sm text-white md:text-base">{address ?? "Connect to see your holdings"}</p>
            </div>
          </div>
          {isConnected ? (
            <div className="text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Balance</p>
              <EthAmount value={balance.data?.value} className="mt-1 text-3xl" />
            </div>
          ) : (
            <ConnectWallet />
          )}
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            onClick={() => setActive(index)}
            className={cn(
              "focus-ring flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all",
              active === index ? "border-accent/40 bg-accent/10 text-white" : "border-white/[.07] bg-white/[.02] text-slate-400 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <div key={active} className="animate-fade-up">
        <EmptyState icon={<tab.icon className="h-6 w-6" />} title={`Nothing in ${tab.label.toLowerCase()} yet`} hint={tab.hint} />
      </div>
    </div>
  );
}
