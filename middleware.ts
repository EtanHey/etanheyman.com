import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REMOVED_ROUTES = [
  /^\/admin(?:\/|$)/,
  /^\/projects\/add(?:\/|$)/,
  /^\/projects\/[^/]+\/edit(?:\/|$)/,
  /^\/api\/(?:projects|uploadthing)(?:\/|$)/,
];

function safeDecodePathname(pathname: string): string | null {
  try {
    return decodeURIComponent(pathname).replace(/\/+/g, "/");
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const decodedPathname = safeDecodePathname(pathname);
  const normalizedPathname = pathname.replace(/\/+/g, "/");

  const isRemovedRoute =
    decodedPathname === null ||
    REMOVED_ROUTES.some(
      (route) => route.test(normalizedPathname) || route.test(decodedPathname),
    );

  if (isRemovedRoute) {
    // AIDEV-NOTE: Keep retired editor paths from falling through to public slug pages.
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

// Run middleware on all routes except static docsite
export const config = {
  matcher: ["/((?!golems(?:/|$)).*)"],
};
