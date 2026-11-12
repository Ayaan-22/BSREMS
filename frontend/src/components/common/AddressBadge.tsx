import { shortenAddress } from "../../lib/utils";
import { addressGradient } from "../../lib/visuals";
import { cn } from "../../lib/utils";

export function AddressAvatar({ address, className }: { address?: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-5 w-5 shrink-0 rounded-full ring-1 ring-white/20", className)}
      style={{ background: address ? addressGradient(address) : "rgba(255,255,255,.1)" }}
    />
  );
}

export function AddressBadge({ address, className }: { address?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] py-1 pl-1 pr-3 font-mono text-xs text-slate-300", className)} title={address}>
      <AddressAvatar address={address} />
      {shortenAddress(address)}
    </span>
  );
}
