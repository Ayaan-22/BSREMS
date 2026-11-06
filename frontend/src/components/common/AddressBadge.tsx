import { shortenAddress } from "../../lib/utils";

export function AddressBadge({ address }: { address?: string }) {
  return <span className="rounded bg-white/5 px-2 py-1 font-mono text-xs text-slate-300">{shortenAddress(address)}</span>;
}
