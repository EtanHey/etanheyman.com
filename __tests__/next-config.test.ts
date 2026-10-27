import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("response security headers", () => {
  it("disables the Next.js powered-by header", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("applies the security headers to every path, including HTML and APIs", async () => {
    expect(await nextConfig.headers?.()).toEqual([
      {
        source: "/:path*",
        headers: expect.arrayContaining([
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ]),
      },
    ]);
  });

  it("ships a compatible CSP in report-only mode without enforcing it", async () => {
    const routes = await nextConfig.headers?.();
    const headers = routes?.find(
      (route) => route.source === "/:path*",
    )?.headers;
    expect(headers).toBeDefined();
    expect(
      headers?.some((header) => header.key === "Content-Security-Policy"),
    ).toBe(false);

    const policy = headers?.find(
      (header) => header.key === "Content-Security-Policy-Report-Only",
    )?.value;
    expect(policy).toBeDefined();
    const directives = policy?.split(";").map((directive) => directive.trim());
    expect(directives).toEqual(
      expect.arrayContaining([
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://utfs.io https://mkijzwkuubtfjqcemorx.supabase.co https://avatars.githubusercontent.com",
        "font-src 'self' data:",
        "connect-src 'self' https://mkijzwkuubtfjqcemorx.supabase.co wss://mkijzwkuubtfjqcemorx.supabase.co https://vitals.vercel-insights.com https://vitals.vercel-analytics.com",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "base-uri 'self'",
      ]),
    );
  });
});
