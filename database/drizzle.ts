// database/drizzle.ts
let _db: any;

export async function getDb() {
  if (_db) return _db;

  const { neon } = await import('@neondatabase/serverless');
  const { drizzle } = await import('drizzle-orm/neon-http');

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is missing (check .env.local)');

  const sql = neon(url);
  _db = drizzle({ client: sql });
  return _db;
}
