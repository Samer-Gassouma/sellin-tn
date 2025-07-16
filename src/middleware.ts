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

  // For Vercel deployment, we'll use path-based routing instead of subdomains
  if (hostname.includes('vercel.app')) {
    // On Vercel, let Next.js handle routing normally (no subdomain rewriting)
    return NextResponse.next();
  }

  // For local development with sellin.tn domains, handle subdomain routing
  if (hostname.includes('sellin.tn')) {
    const parts = hostname.split('.');
    
    if (parts.length >= 3) {
      const subdomain = parts[0];
      
      // Skip www subdomain
      if (subdomain === 'www') {
        return NextResponse.next();
      }

      // If we have a valid subdomain, rewrite to the store page
      if (subdomain && subdomain !== 'sellin-tn') {
        url.pathname = `/store/${subdomain}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // Continue to main site for all other cases
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