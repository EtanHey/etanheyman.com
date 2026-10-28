import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { config, middleware } from "@/middleware";

describe.each([
  "/admin",
  "/admin/golem",
  "/admin/golem/recruiter",
  "/admin/golem/alerts",
  "/admin/golem/nightshift",
  "/admin/golem/content",
  "/projects/add",
  "/projects/add/",
  "/projects/example/edit",
  "/projects/example/edit/",
  "/api/projects",
  "/api/projects/example",
  "/api/uploadthing",
  "/api/uploadthing/direct",
  "/api/uploadthing/delete",
  "/projects/%61dd",
  "/projects/x/%65dit",
  "/admin%2Fgolem",
  "/projects%2Fadd",
  "/projects/x%2Fedit",
  "/api/%75ploadthing",
  "/api%2Fprojects",
  "/projects//%61dd",
  "/projects/x//%65dit",
  "/admin//%67olem",
  "/%E0%A4%A",
])("retired route %s", (pathname) => {
  it("matches middleware and returns 404 without redirecting", async () => {
    expect(unstable_doesMiddlewareMatch({ config, url: pathname })).toBe(true);
    const response = await middleware(
      new NextRequest(`https://example.test${pathname}?from=projects`),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("location")).toBeNull();
  });
});

it.each([
  "/",
  "/contact",
  "/projects",
  "/projects/example",
  "/projects/additional",
  "/projects/example/editorial",
  "/api/projects-other",
  "/golems",
  "/golems/docs",
])("keeps public route %s accessible", async (pathname) => {
  const response = await middleware(
    new NextRequest(`https://example.test${pathname}`),
  );
  expect(response.headers.get("x-middleware-next")).toBe("1");
});

it.each(["/golems", "/golems/docs/intro"])(
  "excludes public docs %s from middleware",
  (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
  },
);
