// lib/config.client.ts  (client-safe only)
export const clientEnv = {
  apiEndpoint:
    process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3000/api',
  prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
  imagekit: {
    publicKey: process.env.NEXT_PUBLIC_IK_PUBLIC_KEY || '',
    urlEndpoint: process.env.NEXT_PUBLIC_IK_URL_ENDPOINT || '',
  },
};
