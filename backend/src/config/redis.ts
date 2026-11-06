import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  socket: { connectTimeout: 2000, reconnectStrategy: false },
  disableOfflineQueue: true
});

redis.on("error", (error: Error) => {
  console.warn("Redis cache unavailable:", error.message);
});

export async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
}
