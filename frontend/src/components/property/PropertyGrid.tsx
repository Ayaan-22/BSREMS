import type { Property } from "../../types/property";
import { EmptyState } from "../common/EmptyState";
import { PropertyCard } from "./PropertyCard";

export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (!properties.length) return <EmptyState title="No properties match the current filters" />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{properties.map((property) => <PropertyCard key={property._id || property.propertyId} property={property} />)}</div>;
}
