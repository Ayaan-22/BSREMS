import { Router } from "express";
import { param } from "express-validator";
import { Property } from "../models/Property.js";
import { EventLog } from "../models/EventLog.js";
import { validate } from "../middleware/errors.js";

export const userRouter = Router();

userRouter.get("/:address/portfolio", param("address").isEthereumAddress(), validate, async (req, res) => {
  const address = req.params.address.toLowerCase();
  const [properties, events] = await Promise.all([
    Property.find({ owner: address }).sort({ updatedAt: -1 }).lean(),
    EventLog.find({ $or: [{ "args.owner": address }, { "args.buyer": address }, { "args.from": address }, { "args.to": address }] })
      .sort({ blockNumber: -1 })
      .lean()
  ]);
  res.json({ address, properties, events });
});
