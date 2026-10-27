import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { isOwner } from "@/app/lib/auth";

beforeEach(() => {
  vi.stubEnv("ALLOWED_EMAILS", " other@example.test, OWNER@EXAMPLE.TEST ");
  vi.stubEnv("ALLOWED_GITHUB_USERNAMES", " other, OwNeR ");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it.each([
  { email: "owner@example.test" },
  { email: "Owner@Example.Test" },
  { githubUsername: "owner" },
  { githubUsername: "OWNER" },
])("matches trimmed allowlists case-insensitively: %j", (identity) => {
  expect(isOwner(identity)).toBe(true);
});
it.each([undefined, "", " , "])(
  "fails closed when both allowlists are empty: %j",
  (value) => {
    vi.stubEnv("ALLOWED_EMAILS", value);
    vi.stubEnv("ALLOWED_GITHUB_USERNAMES", value);
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      isOwner({ email: "owner@example.test", githubUsername: "owner" }),
    ).toBe(false);
  },
);
it.each([
  {},
  { email: null },
  { githubUsername: 123 },
  { email: "stranger@example.test", githubUsername: "stranger" },
])("denies missing or unmatched identities: %j", (identity) => {
  expect(isOwner(identity)).toBe(false);
});
