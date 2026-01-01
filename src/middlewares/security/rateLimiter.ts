import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore, { RedisReply } from "rate-limit-redis";
import redisCache from "../../utils/redisCache";
import { Request } from "express";
import Redis from 'ioredis';

type LimiterType = "global" | "auth" | "api" | "checkout";

const CONFIG: Record<LimiterType, { windowMs: number; max: number }> = {
  global: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
  api: {
    windowMs: 1 * 60 * 1000,
    max: 60,
  },
  checkout: {
    windowMs: 1 * 60 * 1000,
    max: 20,
  },
};

/**
 * Key: userId → fallback to IP
 */
const keyGenerator = (req: Request): string => {
  const userId = (req as any)?.user?.id;

  if (userId) {
    return `u:${userId}`;
  }

  // ✅ TS-safe IPv4 + IPv6 handling
  return `ip:${ipKeyGenerator(req as any)}`;
};

/**
 * Safe wrapper for Redis commands
 */
const sendCommand = (command: string, ...args: string[]): Promise<RedisReply> => {
  const client = redisCache["client"] as Redis;
  return client.call(command, ...args) as Promise<RedisReply>;
};

/**
 * Factory
 */
const createLimiter = (type: LimiterType) =>
  rateLimit({
    ...CONFIG[type],
    keyGenerator,
    store: new RedisStore({
      sendCommand,
      prefix: `rl:${type}:`,
    }),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => !redisCache.isReady(),
    handler: (_req, res) =>
      res.status(429).json({
        success: false,
        message: "Too many requests, try again later.",
      }),
  });

/**
 * Ready-to-use exports
 */
export const globalLimiter = createLimiter("global");
export const authLimiter = createLimiter("auth");

/**
 * Route-based limiter
 */
export const routeLimiter = (type: Exclude<LimiterType, "global" | "auth">) =>
  createLimiter(type);