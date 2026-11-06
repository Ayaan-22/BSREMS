import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  { name: String, ipfs: String, type: String },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    chainId: { type: Number, index: true },
    propertyId: { type: Number, unique: true, sparse: true, index: true },
    owner: { type: String, required: true, lowercase: true, index: true },
    status: { type: String, enum: ["Active", "UnderContract", "Sold", "Delisted"], default: "Active", index: true },
    verified: { type: Boolean, default: false, index: true },
    ipfsMetadataHash: { type: String, required: true },
    metadata: {
      name: String,
      description: String,
      type: String,
      subtype: String,
      listing: String,
      price_eth: String,
      location: {
        address: String,
        city: String,
        country: String,
        coordinates: { lat: Number, lng: Number }
      },
      details: {
        bedrooms: Number,
        bathrooms: Number,
        area_sqft: Number,
        year_built: Number,
        parking: Boolean,
        furnished: Boolean
      },
      images: [String],
      documents: [documentSchema],
      amenities: [String],
      created_at: String,
      schema_version: String
    },
    priceWei: String,
    lastTxHash: String
  },
  { timestamps: true }
);

propertySchema.index({ "metadata.location.city": 1, status: 1, verified: 1 });
propertySchema.index({ owner: 1, status: 1 });

export const Property = mongoose.model("Property", propertySchema);
