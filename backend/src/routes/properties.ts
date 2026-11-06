import { Router } from "express";
import multer from "multer";
import { body, param, query } from "express-validator";
import { Property } from "../models/Property.js";
import { EventLog } from "../models/EventLog.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/errors.js";
import { pinFile, pinJson } from "../services/ipfs.js";

export const propertiesRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

propertiesRouter.get(
  "/",
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  validate,
  async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.verifiedOnly === "true") filter.verified = true;
    if (req.query.city) filter["metadata.location.city"] = new RegExp(String(req.query.city), "i");
    if (req.query.type) filter["metadata.type"] = req.query.type;
    if (req.query.search) filter.$text = { $search: String(req.query.search) };
    const [items, total] = await Promise.all([
      Property.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Property.countDocuments(filter)
    ]);
    res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  }
);

propertiesRouter.get("/:id", param("id").isMongoId(), validate, async (req, res) => {
  const property = await Property.findById(req.params.id).lean();
  if (!property) return res.status(404).json({ error: "Property not found" });
  res.json(property);
});

propertiesRouter.post(
  "/metadata",
  authenticate,
  body("name").isString().notEmpty(),
  body("description").isString().notEmpty(),
  body("type").isString().notEmpty(),
  body("listing").isIn(["sale", "rent"]),
  body("price_eth").isString().notEmpty(),
  validate,
  async (req, res) => {
    const metadata = { ...req.body, created_at: new Date().toISOString(), schema_version: "1.0" };
    const { cid } = await pinJson(metadata);
    res.status(201).json({ cid, uri: `ipfs://${cid}`, metadata });
  }
);

propertiesRouter.post("/ipfs/upload", authenticate, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "file is required" });
  const { cid } = await pinFile(req.file.buffer, req.file.originalname);
  res.status(201).json({ cid, uri: `ipfs://${cid}` });
});

propertiesRouter.get("/:id/history", param("id").isMongoId(), validate, async (req, res) => {
  const property = await Property.findById(req.params.id).lean();
  if (!property) return res.status(404).json({ error: "Property not found" });
  const events = await EventLog.find({ propertyId: property.propertyId }).sort({ blockNumber: -1 }).lean();
  res.json({ propertyId: property.propertyId, events });
});
