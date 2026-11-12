import { formatEther } from "viem";
import { cn } from "../../lib/utils";

/** ETH value with a diamond glyph, big number and a quiet unit. */
export function EthAmount({ value, className, unitClassName }: { value?: bigint | string; className?: string; unitClassName?: string }) {
  const amount = value ? Number(formatEther(BigInt(value))) : 0;
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 font-mono font-semibold text-white", className)}>
      <svg viewBox="0 0 10 16" className="h-[0.8em] w-auto self-center fill-accent-soft" aria-hidden>
        <path d="M5 0 0 8.1 5 11l5-2.9zM5 12 0 9l5 7 5-7z" />
      </svg>
      <span className="tabular-nums">{amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
      <span className={cn("text-[0.7em] font-medium text-muted", unitClassName)}>ETH</span>
    </span>
  );
}
