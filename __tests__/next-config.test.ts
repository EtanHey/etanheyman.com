import { describe, expect, it, vi } from "vitest";
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

  it("enforces a CSP limited to resources used by the public site", async () => {
    const routes = await nextConfig.headers?.();
    const headers = routes?.find(
      (route) => route.source === "/:path*",
    )?.headers;
    expect(headers).toBeDefined();
    expect(
      headers?.some(
        (header) => header.key === "Content-Security-Policy-Report-Only",
      ),
    ).toBe(false);

    const policy = headers?.find(
      (header) => header.key === "Content-Security-Policy",
    )?.value;
    expect(policy).toBeDefined();
    const directives = policy?.split(";").map((directive) => directive.trim());
    expect(directives).toEqual([
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://utfs.io https://mkijzwkuubtfjqcemorx.supabase.co",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]);
    expect(policy).not.toContain("'unsafe-eval'");
  });

  it.each(["development", "production"])(
    "allows eval only for Next's development runtime (%s)",
    async (environment) => {
      vi.stubEnv("NODE_ENV", environment);
      vi.resetModules();
      try {
        const { default: config } = await import("../next.config");
        const routes = await config.headers?.();
        const policy = routes?.[0].headers.find(
          (header) => header.key === "Content-Security-Policy",
        )?.value;
        expect(policy).toBeDefined();
        expect(policy?.includes("'unsafe-eval'")).toBe(
          environment === "development",
        );
      } finally {
        vi.unstubAllEnvs();
        vi.resetModules();
      }
    },
  );
});
