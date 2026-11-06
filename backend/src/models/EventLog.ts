import mongoose from "mongoose";

const eventLogSchema = new mongoose.Schema(
  {
    contract: { type: String, required: true },
    eventName: { type: String, required: true, index: true },
    propertyId: { type: Number, index: true },
    escrowId: { type: Number, index: true },
    args: { type: mongoose.Schema.Types.Mixed },
    txHash: { type: String, required: true, unique: true },
    blockNumber: Number,
    blockTimestamp: Date
  },
  { timestamps: true }
);

export const EventLog = mongoose.model("EventLog", eventLogSchema);
