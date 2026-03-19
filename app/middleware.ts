import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded && forwarded.length > 0) {
    const firstIP = forwarded.split(',')[0];
    return firstIP?.trim() ?? 'unknown';
  }
  
  if (realIP && realIP.length > 0) {
    return realIP;
  }
  
  return 'unknown';
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const clientIP = getClientIP(request) ?? 'unknown';
  
  response.cookies.set('client-ip', clientIP, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
  });
  
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/api/auth/') || path.startsWith('/api/verify')) {
    try {
      await checkRateLimit(clientIP, 'email');
    } catch {
      return new NextResponse('Too many requests', { status: 429 });
    }
  }
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
