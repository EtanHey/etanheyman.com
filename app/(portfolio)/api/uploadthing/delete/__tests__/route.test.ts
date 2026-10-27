import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { POST } from "../route";

const { deleteFiles } = vi.hoisted(() => ({ deleteFiles: vi.fn() }));
vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("uploadthing/server", () => ({
  UTApi: class {
    deleteFiles = deleteFiles;
  },
}));

const owner = { email: "owner@example.test", githubUsername: "owner" };
function request(body: unknown) {
  return new NextRequest("http://localhost/api/uploadthing/delete", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("ALLOWED_EMAILS", "");
  vi.stubEnv("ALLOWED_GITHUB_USERNAMES", "owner");
  vi.mocked(getServerSession).mockResolvedValue({
    user: owner,
    expires: "2099-01-01",
  });
  deleteFiles.mockResolvedValue({ success: true });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("owner-only deletion", () => {
  it.each([
    null,
    { expires: "2099-01-01" },
    { user: {}, expires: "2099-01-01" },
    {
      user: { email: "stranger@example.test", githubUsername: "stranger" },
      expires: "2099-01-01",
    },
  ])(
    "denies anonymous and signed-in non-owners before parsing the body",
    async (session) => {
      vi.mocked(getServerSession).mockResolvedValue(session);
      const req = request({ fileKey: "public-key" });
      const parse = vi.spyOn(req, "json");
      expect((await POST(req)).status).toBe(403);
      expect(parse).not.toHaveBeenCalled();
      expect(deleteFiles).not.toHaveBeenCalled();
    },
  );
  it.each([undefined, "", " , "])(
    "denies existing sessions with empty allowlists (%s)",
    async (value) => {
      vi.stubEnv("ALLOWED_EMAILS", value);
      vi.stubEnv("ALLOWED_GITHUB_USERNAMES", value);
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect((await POST(request({ fileKey: "public-key" }))).status).toBe(403);
      expect(deleteFiles).not.toHaveBeenCalled();
    },
  );
  it.each(["email", "username"])("allows the owner by %s", async (identity) => {
    vi.stubEnv(
      "ALLOWED_EMAILS",
      identity === "email" ? "other@example.test, owner@example.test " : "",
    );
    vi.stubEnv(
      "ALLOWED_GITHUB_USERNAMES",
      identity === "username" ? "other, owner " : "",
    );
    const keys = ["first-key", "second-key"];
    expect((await POST(request({ fileKey: keys }))).status).toBe(200);
    expect(deleteFiles).toHaveBeenCalledExactlyOnceWith(keys);
  });
  it("allows a single key at the length limit", async () => {
    const fileKey = "k".repeat(256);
    expect((await POST(request({ fileKey }))).status).toBe(200);
    expect(deleteFiles).toHaveBeenCalledExactlyOnceWith(fileKey);
  });
  it("allows the maximum key count", async () => {
    const fileKey = Array.from({ length: 100 }, (_, index) => `key-${index}`);
    expect((await POST(request({ fileKey }))).status).toBe(200);
    expect(deleteFiles).toHaveBeenCalledExactlyOnceWith(fileKey);
  });
  it.each([
    null,
    {},
    true,
    "key",
    { fileKey: 123 },
    { fileKey: "" },
    { fileKey: " " },
    { fileKey: [] },
    { fileKey: ["key", 123] },
    { fileKey: [""] },
    { fileKey: "k".repeat(257) },
    { fileKey: ["k".repeat(257)] },
    { fileKey: Array(101).fill("key") },
  ])("rejects invalid keys: %j", async (body) => {
    expect((await POST(request(body))).status).toBe(400);
    expect(deleteFiles).not.toHaveBeenCalled();
  });
  it("rejects malformed JSON", async () => {
    const req = new NextRequest("http://localhost/api/uploadthing/delete", {
      method: "POST",
      body: "{",
    });
    expect((await POST(req)).status).toBe(400);
    expect(deleteFiles).not.toHaveBeenCalled();
  });
});

describe("OAuth owner allowlists", () => {
  const signIn = authOptions.callbacks!.signIn!;
  const profile = { sub: "1", login: owner.githubUsername };
  const args = {
    user: { id: "1", email: owner.email },
    account: { provider: "github", type: "oauth", providerAccountId: "1" },
    profile,
  } satisfies Parameters<typeof signIn>[0];
  it.each([undefined, "", " , "])(
    "fails closed and names missing configuration (%s)",
    async (value) => {
      vi.stubEnv("ALLOWED_EMAILS", value);
      vi.stubEnv("ALLOWED_GITHUB_USERNAMES", value);
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(await signIn(args)).toBe(false);
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining("ALLOWED_EMAILS"),
      );
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining("ALLOWED_GITHUB_USERNAMES"),
      );
    },
  );
  it("allows GitHub owner and denies a different account", async () => {
    expect(await signIn(args)).toBe(true);
    const stranger = { sub: "2", login: "stranger" };
    expect(await signIn({ ...args, profile: stranger })).toBe(false);
  });
  it("allows email-only configuration", async () => {
    vi.stubEnv("ALLOWED_GITHUB_USERNAMES", "");
    vi.stubEnv("ALLOWED_EMAILS", "other@example.test, owner@example.test ");
    expect(await signIn(args)).toBe(true);
  });
  it("denies missing GitHub identity and other providers", async () => {
    expect(await signIn({ ...args, profile: undefined })).toBe(false);
    expect(await signIn({ ...args, account: null })).toBe(false);
  });
});
