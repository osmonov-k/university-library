// app/api/_debug/env/route.ts
export async function GET() {
  return new Response(
    JSON.stringify({
      runtime: process.env.NEXT_RUNTIME || 'node',
      has_DATABASE_URL: Boolean(process.env.DATABASE_URL),
      has_IK_PRIVATE_KEY: Boolean(process.env.IK_PRIVATE_KEY),
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}
