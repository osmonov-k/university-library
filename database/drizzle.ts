// database/drizzle.ts
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '@/database/schema'; // static import keeps types nice

let _dbPromise: Promise<NeonHttpDatabase<typeof schema>> | undefined;

export function getDb(): Promise<NeonHttpDatabase<typeof schema>> {
  if (_dbPromise) return _dbPromise;

  _dbPromise = (async () => {
    const { neon } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-http');

    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is missing (check .env.local)');

    const sql = neon(url);
    return drizzle(sql, { schema }); // ✅ correct
  })();

  return _dbPromise;
}
