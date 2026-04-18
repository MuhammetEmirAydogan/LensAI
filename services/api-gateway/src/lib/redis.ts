import Redis from 'ioredis';
import { logger } from './logger';

const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  password: process.env['REDIS_PASSWORD'] || undefined,
  tls: process.env['REDIS_TLS'] === 'true' ? {} : undefined,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
    return targetErrors.some((e) => err.message.includes(e));
  },
  maxRetriesPerRequest: 3,
  lazyConnect: false,
  enableReadyCheck: true,
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error({ error: err.message }, 'Redis error');
});

redis.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

// ─────────────────────────────────────
// CACHE HELPERS
// ─────────────────────────────────────
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, serialized);
    } else {
      await redis.set(key, serialized);
    }
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },

  async increment(key: string, ttlSeconds?: number): Promise<number> {
    const result = await redis.incr(key);
    if (ttlSeconds && result === 1) {
      await redis.expire(key, ttlSeconds);
    }
    return result;
  },
};

export default redis;
