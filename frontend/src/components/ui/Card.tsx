import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { trackSpotlight } from "../../lib/visuals";

type CardProps = HTMLAttributes<HTMLDivElement> & { glow?: boolean };

export function Card({ className, glow, onMouseMove, ...props }: CardProps) {
  return (
    <div
      className={cn("glass spotlight rounded-2xl p-6", glow && "ring-gradient", className)}
      onMouseMove={(event) => {
        trackSpotlight(event);
        onMouseMove?.(event);
      }}
      {...props}
    />
  );
}

export function CardTitle({ children, icon, action }: { children: ReactNode; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-3 text-base font-semibold tracking-tight text-white">
        {icon && <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent-soft">{icon}</span>}
        {children}
      </h2>
      {action}
    </div>
  );
}
