// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import redis from '@/database/redis';

// Tweak these numbers to taste
export const ratelimit = new Ratelimit({
  redis,
  // e.g. allow 5 attempts per minute (per key)
  limiter: Ratelimit.fixedWindow(5, '1 m'),
  analytics: true,
  prefix: 'rl',
});

export default ratelimit;
