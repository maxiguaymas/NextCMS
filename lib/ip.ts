import { cookies } from 'next/headers';

export async function getClientIP(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const ipCookie = cookieStore.get('client-ip');
    return ipCookie?.value || 'unknown';
  } catch {
    return 'unknown';
  }
}
