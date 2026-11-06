import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ error: "Validation failed", details: result.array() });
  next();
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  res.status(500).json({ error: error.message || "Internal server error" });
}
