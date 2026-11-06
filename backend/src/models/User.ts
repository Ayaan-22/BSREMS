import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, unique: true, lowercase: true, index: true },
    nonce: String,
    nonceExpiresAt: Date,
    role: { type: String, enum: ["user", "verifier", "arbiter", "admin"], default: "user" },
    lastLoginAt: Date
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
