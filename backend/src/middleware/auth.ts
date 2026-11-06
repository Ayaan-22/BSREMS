import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthUser = { sub: string; role: string };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.header("authorization")?.replace(/^Bearer /i, "");
  if (!token) return res.status(401).json({ error: "Missing bearer token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-change-me") as AuthUser;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Missing user" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Insufficient role" });
    next();
  };
}
