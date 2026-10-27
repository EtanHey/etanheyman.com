import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isOwner } from "@/lib/auth/owner";

const PROTECTED_ROUTES = [
  /^\/admin\/golem(?:\/|$)/,
  /^\/projects\/add(?:\/|$)/,
  /^\/projects\/[^/]+\/edit(?:\/|$)/,
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    route.test(pathname),
  );

  if (isProtectedRoute) {
    // Check for valid session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Redirect to login page
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    if (!isOwner({ email: token.email, githubUsername: token.githubUsername })) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Run middleware on all routes except static docsite
export const config = {
  matcher: ["/((?!golems(?:/|$)).*)"],
};
