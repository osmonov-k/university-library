import { headers } from 'next/headers';

export async function getClientIp() {
  const h = await headers(); // <-- await because it's a Promise
  const xff = h.get('x-forwarded-for') || '';
  const ip =
    xff
      .split(',')
      .map((s) => s.trim())
      .find(Boolean) ||
    h.get('x-real-ip') ||
    '127.0.0.1';
  return ip;
}

export function signInKey(ip: string, email?: string) {
  return {
    ipKey: `signin:ip:${ip}`,
    idKey: `signin:id:${(email || 'unknown').toLowerCase()}`,
  };
}

export function signOutKey(ip: string) {
  return `signout:ip:${ip}`;
}
