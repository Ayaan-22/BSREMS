export type PropertyStatus = "Active" | "UnderContract" | "Sold" | "Delisted";

export type PropertyMetadata = {
  name: string;
  description: string;
  type: string;
  subtype: string;
  listing: "sale" | "rent";
  price_eth: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    year_built: number;
    parking: boolean;
    furnished: boolean;
  };
  images: string[];
  documents: Array<{ name: string; ipfs: string; type: string }>;
  amenities: string[];
  created_at: string;
  schema_version: string;
};

export type Property = {
  _id?: string;
  propertyId?: number;
  owner: string;
  status: PropertyStatus;
  verified: boolean;
  ipfsMetadataHash: string;
  metadata: PropertyMetadata;
  priceWei: string;
  updatedAt?: string;
};
