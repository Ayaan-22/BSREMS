import { BadgeCheck, Hourglass } from "lucide-react";
import { cn } from "../../lib/utils";
import { STATUS_STYLES } from "../../lib/visuals";
import type { PropertyStatus } from "../../types/property";

export function StatusPill({ status = "Active", className }: { status?: PropertyStatus; className?: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Active;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md", style.chip, className)}>
      <span className="relative flex h-1.5 w-1.5">
        {status === "Active" && <span className={cn("absolute inset-0 animate-ping2 rounded-full", style.dot)} />}
        <span className={cn("relative h-1.5 w-1.5 rounded-full", style.dot)} />
      </span>
      {style.label}
    </span>
  );
}

export function VerifiedPill({ verified, className }: { verified?: boolean; className?: string }) {
  return verified ? (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-success/30 bg-ink-950/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur-md", className)}>
      <BadgeCheck className="h-3.5 w-3.5" /> Verified
    </span>
  ) : (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-white/10 bg-ink-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-md", className)}>
      <Hourglass className="h-3 w-3" /> Awaiting verification
    </span>
  );
}
