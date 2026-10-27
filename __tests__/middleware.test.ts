import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { middleware } from "@/middleware";

vi.mock("next-auth/jwt", () => ({ getToken: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("ALLOWED_EMAILS", "");
  vi.stubEnv("ALLOWED_GITHUB_USERNAMES", "owner");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe.each([
  "/admin/golem",
  "/admin/golem/settings",
  "/projects/add",
  "/projects/add/",
  "/projects/example/edit",
  "/projects/example/edit/",
])("owner-only page %s", (pathname) => {
  it("redirects anonymous visitors to login with a callback", async () => {
    vi.mocked(getToken).mockResolvedValue(null);
    const response = await middleware(
      new NextRequest(`https://example.test${pathname}?from=projects`),
    );
    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/admin");
    expect(location.searchParams.get("callbackUrl")).toBe(
      `${pathname}?from=projects`,
    );
  });
  it("redirects signed-in non-owners to unauthorized", async () => {
    vi.mocked(getToken).mockResolvedValue({ githubUsername: "stranger" });
    const response = await middleware(
      new NextRequest(`https://example.test${pathname}`),
    );
    expect(response.headers.get("location")).toBe(
      "https://example.test/unauthorized",
    );
  });
  it.each(["email", "github"])(
    "accepts owners by case-insensitive %s allowlist",
    async (identity) => {
      vi.stubEnv(
        "ALLOWED_EMAILS",
        identity === "email" ? " OWNER@EXAMPLE.TEST " : "",
      );
      vi.stubEnv(
        "ALLOWED_GITHUB_USERNAMES",
        identity === "github" ? " OwNeR " : "",
      );
      vi.mocked(getToken).mockResolvedValue({
        email: "owner@example.test",
        githubUsername: "owner",
      });
      const response = await middleware(
        new NextRequest(`https://example.test${pathname}`),
      );
      expect(response.headers.get("x-middleware-next")).toBe("1");
    },
  );
  it("fails closed for existing sessions with empty allowlists", async () => {
    vi.stubEnv("ALLOWED_GITHUB_USERNAMES", "");
    vi.mocked(getToken).mockResolvedValue({ githubUsername: "owner" });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await middleware(
      new NextRequest(`https://example.test${pathname}`),
    );
    expect(response.headers.get("location")).toBe(
      "https://example.test/unauthorized",
    );
  });
});

it.each([
  "/admin",
  "/unauthorized",
  "/projects",
  "/projects/example",
  "/projects/additional",
  "/api/projects",
  "/golems/docs",
])("keeps public route %s accessible", async (pathname) => {
  const response = await middleware(
    new NextRequest(`https://example.test${pathname}`),
  );
  expect(response.headers.get("x-middleware-next")).toBe("1");
  expect(getToken).not.toHaveBeenCalled();
});
