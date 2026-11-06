import { Link } from "react-router-dom";
import type { Property } from "../../types/property";
import { AddressBadge } from "../common/AddressBadge";
import { EthAmount } from "../common/EthAmount";
import { IPFSImage } from "../common/IPFSImage";
import { Card } from "../ui/Card";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-[4/3] overflow-hidden rounded-t">
        <IPFSImage src={property.metadata?.images?.[0]} alt={property.metadata?.name || "Property"} />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/property/${property._id || property.propertyId}`} className="font-semibold hover:text-accent">{property.metadata?.name || "On-chain property"}</Link>
            <p className="text-sm text-muted">{property.metadata?.location?.city || "IPFS metadata pending"}</p>
          </div>
          {property.verified && <span className="rounded bg-success/10 px-2 py-1 text-xs text-success">Verified</span>}
        </div>
        <div className="flex items-center justify-between">
          <EthAmount value={property.priceWei} />
          <AddressBadge address={property.owner} />
        </div>
      </div>
    </Card>
  );
}
