import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isOwner } from "@/lib/auth/owner";

const PROTECTED_ROUTES = [
  /^\/admin\/golem(?:\/|$)/,
  /^\/projects\/add(?:\/|$)/,
  /^\/projects\/[^/]+\/edit(?:\/|$)/,
];

function safeDecodePathname(pathname: string): string | null {
  try {
    return decodeURIComponent(pathname).replace(/\/+/g, "/");
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const decodedPathname = safeDecodePathname(pathname);
  const normalizedPathname = pathname.replace(/\/+/g, "/");

  const isProtectedRoute =
    decodedPathname === null ||
    PROTECTED_ROUTES.some(
      (route) => route.test(normalizedPathname) || route.test(decodedPathname),
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
      loginUrl.searchParams.set(
        "callbackUrl",
        pathname + request.nextUrl.search,
      );
      return NextResponse.redirect(loginUrl);
    }

    if (
      !isOwner({ email: token.email, githubUsername: token.githubUsername })
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Run middleware on all routes except static docsite
export const config = {
  matcher: ["/((?!golems(?:/|$)).*)"],
};
