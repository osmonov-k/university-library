export function requireDatabaseUrl() {
  const url = process.env.DATABASE_URL || '';
  if (!url) throw new Error('DATABASE_URL is missing (check .env.local)');
  return url;
}

export function requireImageKitPrivateKey() {
  const key = process.env.IK_PRIVATE_KEY || '';
  if (!key) throw new Error('IK_PRIVATE_KEY is missing (check .env.local)');
  return key;
}

export function requireRedisUrl() {
  const url = process.env.UPSTASH_REDIS_REST_URL || '';
  if (!url)
    throw new Error('UPSTASH_REDIS_REST_URL is missing (check .env.local)');
  return url;
}

export function requireRedisToken() {
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || '';
  if (!token)
    throw new Error('UPSTASH_REDIS_REST_URL is missing (check .env.local)');
  return token;
}

export function requireQstashUrl() {
  const qstashUrl = process.env.QSTASH_URL || '';
  if (!qstashUrl) throw new Error('QSTASH_URL is missing (check .env.local)');
  return qstashUrl;
}

export function requireQstashToken() {
  const qstashToken = process.env.QSTASH_TOKEN || '';
  if (!qstashToken)
    throw new Error('QSTASH_TOKEN is missing (check .env.local)');
  return qstashToken;
}
