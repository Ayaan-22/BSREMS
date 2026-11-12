import { Check, CircleDollarSign, FilePlus2, Handshake, KeyRound, UserCheck } from "lucide-react";
import { cn } from "../../lib/utils";

const steps = [
  { label: "Created", icon: FilePlus2, hint: "Escrow opened for a listing" },
  { label: "Funded", icon: CircleDollarSign, hint: "Buyer locks the price" },
  { label: "Buyer approved", icon: UserCheck, hint: "Inspection passed" },
  { label: "Seller approved", icon: Handshake, hint: "Seller signs off" },
  { label: "Completed", icon: KeyRound, hint: "Funds released, deed minted" }
];

/** `current` is the index of the step in progress; earlier steps render as done. */
export function EscrowTimeline({ current = 0 }: { current?: number }) {
  return (
    <ol className="relative grid gap-6 md:grid-cols-5 md:gap-3">
      <div className="absolute left-[10%] right-[10%] top-6 hidden h-px bg-white/10 md:block" />
      <div className="absolute left-[10%] top-6 hidden h-px bg-gradient-to-r from-accent to-gold md:block" style={{ width: `${(current / 4) * 80}%` }} />
      {steps.map(({ label, icon: Icon, hint }, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="relative flex items-center gap-4 md:flex-col md:text-center">
            <span
              className={cn(
                "relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-all",
                done && "border-accent bg-accent text-ink-950",
                active && "border-accent/60 bg-ink-900 text-accent-soft shadow-glow",
                !done && !active && "border-white/10 bg-ink-900 text-slate-500"
              )}
            >
              {active && <span className="absolute inset-0 animate-ping2 rounded-2xl border border-accent/50" />}
              {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </span>
            <div>
              <p className={cn("text-sm font-semibold", done || active ? "text-white" : "text-slate-500")}>{label}</p>
              <p className="mt-0.5 text-xs text-muted">{hint}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
