import { MouseEvent, useRef } from "react";
import { cn } from "../../lib/utils";
import { coverFor, propertyTitle } from "../../lib/visuals";
import type { Property } from "../../types/property";
import { AddressBadge } from "../common/AddressBadge";
import { EthAmount } from "../common/EthAmount";
import { IPFSImage } from "../common/IPFSImage";
import { LogoMark } from "../layout/Logo";

/** A holographic ERC-721 deed preview that tilts toward the cursor. */
export function DeedCard({ property, className }: { property?: Property; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(1100px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1100px) rotateY(-8deg) rotateX(4deg)";
  };

  return (
    <div className={cn("relative", className)} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        ref={ref}
        className="ring-gradient relative overflow-hidden rounded-3xl bg-ink-800 p-3 shadow-float transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: "perspective(1100px) rotateY(-8deg) rotateX(4deg)" }}
      >
        <div className="relative aspect-[4/3.3] overflow-hidden rounded-2xl">
          <IPFSImage src={coverFor(property, 900)} alt={propertyTitle(property)} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-soft backdrop-blur-md">
            ERC-721 · Deed
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-display text-3xl leading-none text-white">{propertyTitle(property)}</p>
            <p className="mt-2 font-mono text-[11px] text-slate-300">TOKEN #{String(property?.propertyId ?? 1).padStart(4, "0")} · CHAIN 31337</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Owner</p>
            <AddressBadge address={property?.owner} className="mt-1.5 border-none bg-transparent p-0" />
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Price</p>
            <EthAmount value={property?.priceWei} className="mt-1 text-xl" />
          </div>
          <LogoMark className="hidden h-10 w-10 opacity-80 sm:block" />
        </div>
        <div aria-hidden className="holo pointer-events-none absolute inset-0 animate-sheen rounded-3xl" />
      </div>
    </div>
  );
}
