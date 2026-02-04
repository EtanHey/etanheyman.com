import { geolocation } from '@vercel/functions';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin/golem'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for valid session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      // Redirect to login page
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Optional: Check if user is in allowed list (extra security layer)
    const allowedUsernames = process.env.ALLOWED_GITHUB_USERNAMES?.split(',') || [];
    if (allowedUsernames.length > 0) {
      const username = token.githubUsername as string | undefined;
      if (!username || !allowedUsernames.includes(username)) {
        // User authenticated but not authorized
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

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
