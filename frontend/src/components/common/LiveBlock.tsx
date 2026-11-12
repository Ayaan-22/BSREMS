import { useBlockNumber } from "wagmi";
import { hardhat } from "wagmi/chains";
import { cn } from "../../lib/utils";

/** Latest block on the local chain, polled live. Shows "offline" if the node is down. */
export function useLiveBlock() {
  return useBlockNumber({ chainId: hardhat.id, watch: true, query: { refetchInterval: 4000, retry: false } });
}

export function LiveBlock({ className }: { className?: string }) {
  const { data, isError } = useLiveBlock();
  const online = data !== undefined && !isError;
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 font-mono text-[11px] text-slate-300", className)}>
      <span className="relative flex h-2 w-2">
        {online && <span className="absolute inset-0 animate-ping2 rounded-full bg-success" />}
        <span className={cn("relative h-2 w-2 rounded-full", online ? "bg-success" : "bg-slate-500")} />
      </span>
      {online ? (
        <>
          <span className="text-muted">BLOCK</span>
          <span key={String(data)} className="inline-block animate-fade-up text-white">#{data.toString()}</span>
        </>
      ) : (
        <span className="text-muted">CHAIN OFFLINE</span>
      )}
    </span>
  );
}
