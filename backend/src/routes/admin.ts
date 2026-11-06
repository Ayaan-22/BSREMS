import { Router } from "express";
import { body, param } from "express-validator";
import { Property } from "../models/Property.js";
import { User } from "../models/User.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/errors.js";
import { addressHasAdminAccess } from "../services/contracts.js";

export const adminRouter = Router();
adminRouter.use(authenticate);

adminRouter.get("/queue", requireRole("verifier", "admin"), async (_req, res) => {
  res.json(await Property.find({ verified: false }).sort({ createdAt: 1 }).lean());
});

adminRouter.post("/properties/:id/verify", requireRole("verifier", "admin"), param("id").isMongoId(), validate, async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, { verified: true }, { new: true }).lean();
  if (!property) return res.status(404).json({ error: "Property not found" });
  res.json(property);
});

adminRouter.patch(
  "/users/:address/role",
  requireRole("admin"),
  param("address").isEthereumAddress(),
  body("role").isIn(["user", "verifier", "arbiter", "admin"]),
  validate,
  async (req, res) => {
    const address = req.params.address.toLowerCase();
    const user = await User.findOneAndUpdate({ address }, { address, role: req.body.role }, { upsert: true, new: true }).lean();
    res.json(user);
  }
);

adminRouter.get("/chain-role/:address", param("address").isEthereumAddress(), validate, async (req, res) => {
  const address = req.params.address.toLowerCase();
  res.json({ address, hasAdminAccess: await addressHasAdminAccess(address) });
});
