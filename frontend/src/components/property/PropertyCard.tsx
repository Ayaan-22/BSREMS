import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import { coverFor, propertyTitle, timeAgo, trackSpotlight } from "../../lib/visuals";
import type { Property } from "../../types/property";
import { AddressBadge } from "../common/AddressBadge";
import { EthAmount } from "../common/EthAmount";
import { IPFSImage } from "../common/IPFSImage";
import { StatusPill, VerifiedPill } from "../ui/Badge";

export function PropertyCard({ property }: { property: Property }) {
  const href = `/property/${property._id || property.propertyId}`;
  const location = property.metadata?.location?.city;
  return (
    <Link
      to={href}
      onMouseMove={trackSpotlight}
      className="glass spotlight focus-ring group block overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-white/15 hover:shadow-float"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-110">
          <IPFSImage src={coverFor(property, 800)} alt={propertyTitle(property)} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-ink-900/30" />
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <StatusPill status={property.status} className="bg-ink-950/60" />
          <VerifiedPill verified={property.verified} />
        </div>
        <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2 backdrop-blur-md">
          <EthAmount value={property.priceWei} className="text-lg" />
        </div>
        <span className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-3 place-items-center rounded-full bg-white text-ink-950 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-2xl leading-tight text-white transition-colors group-hover:text-accent-soft">{propertyTitle(property)}</h3>
            <span className="shrink-0 font-mono text-[11px] text-slate-500">#{property.propertyId ?? "—"}</span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5" />
            {location || "Location in IPFS metadata pending"}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-white/[.06] pt-4">
          <AddressBadge address={property.owner} />
          {property.updatedAt && <span className="font-mono text-[11px] text-slate-500">{timeAgo(property.updatedAt)}</span>}
        </div>
      </div>
    </Link>
  );
}
