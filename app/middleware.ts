import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

// Rate limiting for API endpoints
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get IP address for rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Apply rate limiting to sensitive endpoints
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/api/auth/') || path.startsWith('/api/verify')) {
    try {
      await checkRateLimit(ip, 'email');
    } catch {
      return new NextResponse('Too many requests', { status: 429 });
    }
  }
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
