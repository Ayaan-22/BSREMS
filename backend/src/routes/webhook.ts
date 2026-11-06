import { Router } from "express";
import { EventLog } from "../models/EventLog.js";

export const webhookRouter = Router();

webhookRouter.post("/events", async (req, res) => {
  const events = Array.isArray(req.body.events) ? req.body.events : [];
  await EventLog.insertMany(
    events.map((event: any) => ({
      contract: event.contract || "webhook",
      eventName: event.eventName,
      propertyId: event.propertyId,
      escrowId: event.escrowId,
      args: event.args,
      txHash: event.txHash,
      blockNumber: event.blockNumber,
      blockTimestamp: event.blockTimestamp ? new Date(event.blockTimestamp) : new Date()
    })),
    { ordered: false }
  ).catch(() => undefined);
  res.status(202).json({ accepted: events.length });
});
