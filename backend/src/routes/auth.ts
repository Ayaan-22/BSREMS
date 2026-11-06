import { Router } from "express";
import { body, param } from "express-validator";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { validate } from "../middleware/errors.js";
import { authenticate } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.get("/nonce/:address", param("address").isEthereumAddress(), validate, async (req, res) => {
  const address = req.params.address.toLowerCase();
  const nonce = crypto.randomBytes(16).toString("hex");
  const nonceExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await User.updateOne({ address }, { address, nonce, nonceExpiresAt }, { upsert: true });
  res.json({ nonce, message: `Sign in to BSREMS Pro\nNonce: ${nonce}`, expiresAt: nonceExpiresAt.toISOString() });
});

authRouter.post(
  "/verify",
  body("address").isEthereumAddress(),
  body("signature").isString(),
  body("nonce").isString(),
  validate,
  async (req, res) => {
    const address = req.body.address.toLowerCase();
    const user = await User.findOne({ address });
    if (!user || user.nonce !== req.body.nonce || !user.nonceExpiresAt || user.nonceExpiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired nonce" });
    }
    const recovered = ethers.verifyMessage(`Sign in to BSREMS Pro\nNonce: ${req.body.nonce}`, req.body.signature).toLowerCase();
    if (recovered !== address) return res.status(401).json({ error: "Signature verification failed" });
    user.nonce = undefined;
    user.nonceExpiresAt = undefined;
    user.lastLoginAt = new Date();
    await user.save();
    const token = jwt.sign({ sub: address, role: user.role }, process.env.JWT_SECRET || "dev-secret-change-me", { expiresIn: "1h" });
    res.json({ token, address, role: user.role });
  }
);

authRouter.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});
