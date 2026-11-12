import { Search } from "lucide-react";
import type { Property } from "../../types/property";
import { EmptyState } from "../common/EmptyState";
import { Reveal } from "../common/Reveal";
import { PropertyCardSkeleton } from "../common/Skeleton";
import { PropertyCard } from "./PropertyCard";

export function PropertyGrid({ properties, loading, skeletons = 6 }: { properties: Property[]; loading?: boolean; skeletons?: number }) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletons }, (_, index) => <PropertyCardSkeleton key={index} />)}
      </div>
    );
  }
  if (!properties.length) {
    return <EmptyState icon={<Search className="h-6 w-6" />} title="No properties match the current filters" hint="Try a different status, or clear the verified-only toggle." />;
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, index) => (
        <Reveal key={property._id || property.propertyId} delay={(index % 3) * 90}>
          <PropertyCard property={property} />
        </Reveal>
      ))}
    </div>
  );
}
