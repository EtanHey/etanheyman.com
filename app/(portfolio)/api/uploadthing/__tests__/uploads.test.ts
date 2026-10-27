import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "../core";
import { POST as directPOST } from "../direct/route";

const { uploadFiles } = vi.hoisted(() => ({ uploadFiles: vi.fn() }));
vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("uploadthing/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("uploadthing/server")>()),
  UTApi: class { uploadFiles = uploadFiles; },
}));
const providerFetch = vi.fn();
const { POST: standardPOST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: Buffer.from(JSON.stringify({
      apiKey: "sk_test_fixture_only", appId: "test", regions: ["test"],
    })).toString("base64"),
    isDev: false, logLevel: "None", fetch: providerFetch,
  },
});
const endpoints = ["projectLogo", "journeyImage"];
const image = (size = 1, type = "image/png") =>
  new File([new Uint8Array(size)], "image.png", { type });
function directRequest(endpoint: string, files: (File | string)[] = [image()]) {
  const body = new FormData();
  body.append("endpoint", endpoint);
  files.forEach(file => body.append("file", file));
  return new NextRequest("http://localhost/api/uploadthing/direct", { method: "POST", body });
}
function standardRequest(endpoint: string, files = [{ name: "image.png", type: "image/png", size: 1 }]) {
  return new NextRequest(`http://localhost/api/uploadthing?slug=${endpoint}&actionType=upload`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ files, input: null }),
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("ALLOWED_EMAILS", "owner@example.test");
  vi.stubEnv("ALLOWED_GITHUB_USERNAMES", "");
  vi.mocked(getServerSession).mockResolvedValue({ user: { email: "owner@example.test" }, expires: "2099-01-01" });
  uploadFiles.mockResolvedValue({ data: { url: "https://example.test/image.png", key: "test-key" } });
  providerFetch.mockImplementation(async () => Response.json({ ok: true }));
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe.each(endpoints)("owner-only uploads: %s", endpoint => {
  it.each([null, { user: { email: "stranger@example.test" }, expires: "2099-01-01" }])(
    "denies direct uploads from anonymous and signed-in non-owners before parsing", async session => {
      vi.mocked(getServerSession).mockResolvedValue(session);
      const req = directRequest(endpoint);
      const parse = vi.spyOn(req, "formData");
      expect((await directPOST(req)).status).toBe(403);
      expect(parse).not.toHaveBeenCalled();
      expect(uploadFiles).not.toHaveBeenCalled();
    },
  );
  it.each([null, { user: { email: "stranger@example.test" }, expires: "2099-01-01" }])(
    "denies standard uploads from anonymous and signed-in non-owners before provider calls", async session => {
      vi.mocked(getServerSession).mockResolvedValue(session);
      expect((await standardPOST(standardRequest(endpoint))).status).toBe(403);
      expect(providerFetch).not.toHaveBeenCalled();
    },
  );
  it("allows the owner to upload through both paths", async () => {
    const file = image(4 * 1024 * 1024);
    const response = await directPOST(directRequest(endpoint, [file]));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: "https://example.test/image.png", key: "test-key" });
    expect(uploadFiles).toHaveBeenCalledOnce();
    expect(uploadFiles.mock.calls[0][0]).toMatchObject({ name: file.name, type: file.type, size: file.size });
    expect((await standardPOST(standardRequest(endpoint))).status).toBe(200);
    expect(providerFetch).toHaveBeenCalledOnce();
  });
  it.each([
    [], ["not a file"], [image(1, "text/plain")], [image(4 * 1024 * 1024 + 1)], [image(), image()],
  ])("rejects invalid direct files without uploading: %j", async (...files) => {
    expect((await directPOST(directRequest(endpoint, files))).status).toBe(400);
    expect(uploadFiles).not.toHaveBeenCalled();
  });
  it.each([
    [{ name: "file.txt", type: "text/plain", size: 1 }],
    [{ name: "image.png", type: "image/png", size: 4 * 1024 * 1024 + 1 }],
    Array(2).fill({ name: "image.png", type: "image/png", size: 1 }),
  ])("retains standard route limits without contacting the provider: %j", async (...files) => {
    expect((await standardPOST(standardRequest(endpoint, files))).status).toBe(400);
    expect(providerFetch).not.toHaveBeenCalled();
  });
});

it.each(["", "unknown"])("rejects invalid direct endpoints: %s", async endpoint => {
  expect((await directPOST(directRequest(endpoint))).status).toBe(400);
  expect(uploadFiles).not.toHaveBeenCalled();
});
it.each(["file", "extra", "endpoint"])("rejects extra multipart entries: %s", async field => {
  const req = directRequest("projectLogo");
  const body = await req.formData();
  body.append(field, field === "endpoint" ? "journeyImage" : image());
  expect((await directPOST(new NextRequest(req.url, { method: "POST", body }))).status).toBe(400);
  expect(uploadFiles).not.toHaveBeenCalled();
});
