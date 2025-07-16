import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extract subdomain
  const parts = hostname.split('.');
  
  // Check if we have a subdomain (more than 2 parts: subdomain.sellin.tn)
  if (parts.length >= 3) {
    const subdomain = parts[0];
    
    // Skip www subdomain
    if (subdomain === 'www') {
      return NextResponse.next();
    }

    // If we're on a subdomain, rewrite to the store page
    url.pathname = `/store/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  // If no subdomain, continue to main site
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 