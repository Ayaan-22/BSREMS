import "dotenv/config";
import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { randomUUID } from "crypto";
import { connectMongo } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { errorHandler } from "./middleware/errors.js";
import { authRouter } from "./routes/auth.js";
import { propertiesRouter } from "./routes/properties.js";
import { userRouter } from "./routes/user.js";
import { statsRouter } from "./routes/stats.js";
import { adminRouter } from "./routes/admin.js";
import { webhookRouter } from "./routes/webhook.js";
import { startIndexer } from "./services/contracts.js";

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
app.use((req, res, next) => {
  res.setHeader("X-Request-ID", randomUUID());
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/user", userRouter);
app.use("/api/stats", statsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/webhook", webhookRouter);
app.get("/api/health", (_req, res) => res.json({ status: "ok", version: "1.0.0" }));
app.use(errorHandler);

async function bootstrap() {
  await connectMongo();
  void connectRedis().catch(() => undefined);
  startIndexer();
  app.listen(port, () => {
    console.info(`BSREMS Pro API listening on ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});

export default app;
