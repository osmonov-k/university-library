// app/api/_debug/db/route.ts
export const runtime = 'nodejs';
import { requireDatabaseUrl } from '@/lib/config.server-lite';

export async function GET() {
  try {
    const url = requireDatabaseUrl();
    return new Response(
      JSON.stringify({ ok: true, sample: url.slice(0, 20) + '...' }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
    });
  }
}
