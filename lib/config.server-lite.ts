// lib/config.server-lite.ts  (no 'use server', no 'server-only')
export function requireDatabaseUrl() {
  // helpful guard so the error message is precise
  if (typeof window !== 'undefined') {
    throw new Error(
      'DATABASE_URL was accessed from the client. Move this call to an API route or server component.',
    );
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    throw new Error(
      'DATABASE_URL was accessed in the Edge runtime. Use a Node.js route or add `export const runtime = "nodejs"`.',
    );
  }

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is missing (check .env.local)');
  return url;
}
