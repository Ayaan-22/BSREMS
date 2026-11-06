import { Router } from "express";
import { Property } from "../models/Property.js";
import { EventLog } from "../models/EventLog.js";
import { redis } from "../config/redis.js";

export const statsRouter = Router();

statsRouter.get("/", async (_req, res) => {
  const cached = redis.isReady ? await redis.get("bsrems:stats").catch(() => null) : null;
  if (cached) return res.json(JSON.parse(cached));
  const [byStatus, transactionCount] = await Promise.all([
    Property.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    EventLog.countDocuments()
  ]);
  const payload = { byStatus, transactionCount, generatedAt: new Date().toISOString() };
  if (redis.isReady) {
    await redis.set("bsrems:stats", JSON.stringify(payload), { EX: 60 }).catch(() => undefined);
  }
  res.json(payload);
});
