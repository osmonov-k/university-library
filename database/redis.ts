import { requireRedisToken, requireRedisUrl } from '@/lib/config.server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: requireRedisUrl(),
  token: requireRedisToken(),
});

export default redis;
