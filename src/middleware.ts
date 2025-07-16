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

  // Extract subdomain based on environment
  const parts = hostname.split('.');
  let subdomain = '';

  // Handle different domain formats
  if (hostname.includes('vercel.app')) {
    // Vercel deployment: subdomain-sellin-tn.vercel.app or sellin-tn.vercel.app
    if (parts.length >= 3 && !hostname.startsWith('sellin-tn.vercel.app')) {
      // Extract subdomain from: subdomain-sellin-tn.vercel.app
      const firstPart = parts[0];
      if (firstPart.includes('-sellin-tn')) {
        subdomain = firstPart.replace('-sellin-tn', '');
      } else if (firstPart !== 'sellin-tn') {
        subdomain = firstPart;
      }
    }
  } else if (hostname.includes('sellin.tn')) {
    // Local development: subdomain.sellin.tn
    if (parts.length >= 3) {
      subdomain = parts[0];
      
      // Skip www subdomain
      if (subdomain === 'www') {
        return NextResponse.next();
      }
    }
  }

  // If we have a valid subdomain, rewrite to the store page
  if (subdomain && subdomain !== 'www' && subdomain !== 'sellin-tn') {
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