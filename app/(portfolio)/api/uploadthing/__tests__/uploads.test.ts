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
const pngHeader = Buffer.from("89504e470d0a1a0a", "hex");
const image = (size = 8, type = "image/png") =>
  new File([pngHeader.subarray(0, size), new Uint8Array(Math.max(0, size - 8))], "image.png", { type });
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
    [new File(["plain text"], "image.png", { type: "image/png" })],
    [new File([pngHeader], "image.jpg", { type: "image/jpeg" })], [image(0)], [image(7)],
    [new File([pngHeader], "image.bmp", { type: "image/bmp" })],
    [new File([Buffer.from("c7c9c6b8b9e1", "hex")], "image.gif", { type: "image/gif" })],
    [new File(["RIFFxxxxWAVE"], "image.webp", { type: "image/webp" })],
    [new File(["not-ftypavif"], "image.avif", { type: "image/avif" })],
  ])("rejects invalid direct files without uploading: %j", async (...files) => {
    expect((await directPOST(directRequest(endpoint, files))).status).toBe(400);
    expect(uploadFiles).not.toHaveBeenCalled();
  });
  it.each([
    ["png", "89504e470d0a1a0a"], ["jpeg", "ffd8ffe000104a4649460001"],
    ["webp", "524946460c0000005745425056503820"], ["gif", "474946383961"],
    ["gif", "474946383761"], ["avif", "00000018667479706176696600000000617669666d696631"],
    ["avif", "00000018667479706d69663100000000617669666d696631"],
    ["avif", "00000018667479706176697300000000617669666d696631"],
  ])("accepts matching %s headers through both paths", async (type, hex) => {
    const file = new File([Buffer.from(hex, "hex")], `image.${type}`, { type: `image/${type}` });
    expect((await directPOST(directRequest(endpoint, [file]))).status).toBe(200);
    expect(uploadFiles).toHaveBeenCalledOnce();
    expect((await standardPOST(standardRequest(endpoint, [{ name: file.name, type: file.type, size: file.size }]))).status).toBe(200);
    expect(providerFetch).toHaveBeenCalledOnce();
  });
  it.each([
    [{ name: "image.bmp", type: "image/bmp", size: 8 }], [],
    [{ name: "image.png", type: "image/png", size: 8 }, { name: "image.jpg", type: "image/jpeg", size: 8 }],
    [{ name: "file.txt", type: "text/plain", size: 1 }],
    [{ name: "image.png", type: "image/png", size: 4 * 1024 * 1024 + 1 }],
    Array(2).fill({ name: "image.png", type: "image/png", size: 1 }),
  ])("retains standard route limits without contacting the provider: %j", async (...files) => {
    expect((await standardPOST(standardRequest(endpoint, files))).status).toBe(400);
    expect(providerFetch).not.toHaveBeenCalled();
  });
  it("accepts SVG only for logos on both upload paths", async () => {
    const file = new File(['<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>'], "logo.svg", { type: "image/svg+xml" });
    const allowed = endpoint === "projectLogo";
    expect((await directPOST(directRequest(endpoint, [file]))).status).toBe(allowed ? 200 : 400);
    expect(uploadFiles).toHaveBeenCalledTimes(allowed ? 1 : 0);
    expect((await standardPOST(standardRequest(endpoint, [{ name: file.name, type: file.type, size: file.size }]))).status).toBe(allowed ? 200 : 400);
    expect(providerFetch).toHaveBeenCalledTimes(allowed ? 1 : 0);
  });
  it.each([
    [new File([pngHeader], "image.bmp", { type: "image/bmp" }), "Unsupported image type for this upload"],
    [new File(["text"], "image.png", { type: "image/png" }), "Image content does not match its type"],
    [image(4 * 1024 * 1024 + 1), "Image must be 4MB or smaller"],
  ])("explains rejected direct uploads: %s", async (file, message) => {
    const response = await directPOST(directRequest(endpoint, [file]));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: message });
    expect(uploadFiles).not.toHaveBeenCalled();
  });
});

it.each([
  '<svg><script>alert(1)</script></svg>', '<svg onload="alert(1)"/>',
  '<svg ONCLICK = "alert(1)"/>', '<svg><a href="javascript:alert(1)"/></svg>',
  '<svg><foreignObject/></svg>', '<html><svg/></html>', '<svg-not-a-root/>',
  Buffer.from([0xff, 0x3c, 0x73, 0x76, 0x67, 0x2f, 0x3e]),
])("rejects unsafe or invalid SVG logo content: %s", async content => {
  const file = new File([content], "logo.svg", { type: "image/svg+xml" });
  expect((await directPOST(directRequest("projectLogo", [file]))).status).toBe(400);
  expect(uploadFiles).not.toHaveBeenCalled();
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
