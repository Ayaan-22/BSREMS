import mongoose from "mongoose";

export async function connectMongo() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bsrems_pro";
  await mongoose.connect(uri);
}
