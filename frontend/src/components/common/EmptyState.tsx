import type { ReactNode } from "react";
import { Home } from "lucide-react";

export function EmptyState({ title = "No records yet", hint, icon, action }: { title?: string; hint?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="relative flex min-h-56 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[.015] px-6 py-10 text-center">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(circle_at_center,#000,transparent_70%)]" />
      <div className="relative mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-ink-800 text-accent-soft shadow-glow">
        {icon ?? <Home className="h-6 w-6" />}
      </div>
      <p className="relative font-medium text-white">{title}</p>
      {hint && <p className="relative mt-1 max-w-sm text-sm text-muted">{hint}</p>}
      {action && <div className="relative mt-5">{action}</div>}
    </div>
  );
}
