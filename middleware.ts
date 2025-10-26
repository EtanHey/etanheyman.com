import { geolocation } from '@vercel/functions';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get country from Vercel's geolocation
  const { country = 'US' } = geolocation(request);

  // Create response
  const response = NextResponse.next();

  // Add country to a custom header that we can read client-side
  response.headers.set('x-user-country', country);

  return response;
}

// Run middleware on all routes
export const config = {
  matcher: '/:path*',
};
