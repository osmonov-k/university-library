import { clientEnv } from '@/lib/config.client';
import { requireImageKitPrivateKey } from '@/lib/config.server';
import ImageKit from 'imagekit';
import { NextResponse } from 'next/server';

const imagekit = new ImageKit({
  publicKey: clientEnv.imagekit.publicKey, // ok to expose
  privateKey: requireImageKitPrivateKey(), // server-only
  urlEndpoint: clientEnv.imagekit.urlEndpoint,
});

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
