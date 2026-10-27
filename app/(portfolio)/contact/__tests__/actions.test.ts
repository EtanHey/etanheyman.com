import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { send, requestHeaders } = vi.hoisted(() => ({
  send: vi.fn(),
  requestHeaders: new Headers(),
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));
vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));
vi.mock("@/app/components/contact/EmailTemplate", () => ({
  EmailTemplate: vi.fn(() => "<div>Test Email</div>"),
}));

const NOW = 1_800_000_000_000;
const SECRET = "contact-test-secret-not-production";
function token(issuedAt = NOW - 5000, secret = SECRET) {
  return `${issuedAt}.${createHmac("sha256", secret).update(`contact:${issuedAt}`).digest("hex")}`;
}
function validFormData() {
  return {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    message: "This is a test message",
    website: "",
    timingToken: token(),
  };
}
let submit: typeof import("../actions").submitContactForm;

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  vi.stubEnv("NEXTAUTH_SECRET", SECRET);
  requestHeaders.delete("x-vercel-forwarded-for");
  requestHeaders.set("x-forwarded-for", "203.0.113.1");
  send.mockResolvedValue({ data: { id: "test-id" }, error: null });
  for (const method of ["log", "info", "warn", "error"] as const) {
    vi.spyOn(console, method).mockImplementation(() => {});
  }
  submit = (await import("../actions")).submitContactForm;
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("contact submission boundary", () => {
  it("sends exactly one email to the fixed recipient", async () => {
    expect(await submit(validFormData())).toEqual({ success: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "no-reply@contact.heymans.dev",
        to: "etan@heyman.net",
        replyTo: "john@example.com",
        subject: "New contact message from John Doe",
      }),
    );
  });

  it("silently rejects the honeypot without sending", async () => {
    expect(
      await submit({ ...validFormData(), website: "https://spam.example" }),
    ).toEqual({ success: true });
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    ["too fresh", token(NOW - 2999)],
    ["future", token(NOW + 1000)],
    ["expired", token(NOW - 3_600_001)],
    ["forged", token(NOW - 5000, "attacker")],
    [
      "tampered timestamp",
      token().replace(String(NOW - 5000), String(NOW - 6000)),
    ],
    ["missing", undefined],
    ["malformed", "not-a-token"],
    ["wrong type", 123],
    ["oversized", "a".repeat(1000)],
  ])("rejects a %s timing token", async (_, timingToken) => {
    expect((await submit({ ...validFormData(), timingToken })).success).toBe(
      false,
    );
    expect(send).not.toHaveBeenCalled();
  });

  it.each([3000, 3_600_000])(
    "accepts a signed token aged %i ms",
    async (age) => {
      expect(
        (await submit({ ...validFormData(), timingToken: token(NOW - age) }))
          .success,
      ).toBe(true);
      expect(send).toHaveBeenCalledTimes(1);
    },
  );

  it("rejects a fabricated client timestamp without a signed token", async () => {
    expect(
      (
        await submit({
          ...validFormData(),
          timingToken: undefined,
          formLoadedAt: 1,
        })
      ).success,
    ).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });

  it("fails closed without the signing secret", async () => {
    vi.stubEnv("NEXTAUTH_SECRET", "");
    expect((await submit(validFormData())).success).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    ["fullName", "x".repeat(101)],
    ["email", "a".repeat(243) + "@example.com"],
    ["phone", "1".repeat(33)],
    ["message", "m".repeat(5001)],
    ["website", "x".repeat(201)],
    ["fullName", " ".repeat(101)],
    ["fullName", ""],
    ["fullName", " \n\t "],
    ["message", ""],
    ["email", "not-an-email"],
    ["phone", "abc"],
    ["message", { text: "hello" }],
    ["fullName", null],
    ["fullName", 123],
    ["extra", "unexpected"],
  ])("rejects invalid or oversized %s", async (field, value) => {
    expect((await submit({ ...validFormData(), [field]: value })).success).toBe(
      false,
    );
    expect(send).not.toHaveBeenCalled();
  });

  it.each([null, undefined, [], "payload"])(
    "rejects malformed payload %j",
    async (payload) => {
      expect((await submit(payload)).success).toBe(false);
      expect(send).not.toHaveBeenCalled();
    },
  );

  it("accepts field limits and optional phone", async () => {
    expect(
      (
        await submit({
          ...validFormData(),
          fullName: "n".repeat(100),
          email: "a".repeat(242) + "@example.com",
          phone: "",
          message: "m".repeat(5000),
        })
      ).success,
    ).toBe(true);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("trims fields and strips control characters before sending", async () => {
    await submit({
      ...validFormData(),
      fullName: "  John\r\nDoe\u0000  ",
      email: " john@example.com ",
      phone: " +1234567890 ",
      message: " \u0000Hello\nworld\t! ",
    });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "New contact message from JohnDoe",
        replyTo: "john@example.com",
        text: expect.stringContaining("Message:\nHelloworld!"),
      }),
    );
  });

  it("allows only three concurrent submissions per IP in ten minutes", async () => {
    const results = await Promise.all(
      Array.from({ length: 4 }, () => submit(validFormData())),
    );
    expect(results.map((r) => r.success)).toEqual([true, true, true, false]);
    expect(send).toHaveBeenCalledTimes(3);
    requestHeaders.set("x-forwarded-for", "203.0.113.2");
    expect((await submit(validFormData())).success).toBe(true);
    vi.setSystemTime(NOW + 600_000);
    requestHeaders.set("x-forwarded-for", "203.0.113.1");
    expect((await submit(validFormData())).success).toBe(true);
    expect(send).toHaveBeenCalledTimes(5);
  });

  it("counts invalid attempts against the IP limit", async () => {
    for (let i = 0; i < 3; i++)
      await submit({ ...validFormData(), email: "invalid" });
    expect((await submit(validFormData())).success).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });

  it("prefers Vercel's IP header over forwarded input", async () => {
    requestHeaders.set("x-vercel-forwarded-for", "203.0.113.9");
    for (let i = 0; i < 3; i++) await submit(validFormData());
    requestHeaders.set("x-forwarded-for", "203.0.113.10");
    expect((await submit(validFormData())).success).toBe(false);
    expect(send).toHaveBeenCalledTimes(3);
  });

  it("uses a shared limited bucket for missing or invalid IP headers", async () => {
    requestHeaders.delete("x-forwarded-for");
    for (let i = 0; i < 3; i++) await submit(validFormData());
    requestHeaders.set("x-forwarded-for", "arbitrary-attacker-key");
    expect((await submit(validFormData())).success).toBe(false);
    expect(send).toHaveBeenCalledTimes(3);
  });

  it.each(["success", "provider error", "exception"])(
    "logs only an id/outcome on %s",
    async (outcome) => {
      if (outcome === "provider error")
        send.mockResolvedValue({ data: null, error: validFormData() });
      if (outcome === "exception")
        send.mockRejectedValue(new Error(JSON.stringify(validFormData())));
      const result = await submit(validFormData());
      expect(result.success).toBe(outcome === "success");
      const calls = [
        console.log,
        console.info,
        console.warn,
        console.error,
      ].flatMap((fn) => vi.mocked(fn).mock.calls);
      expect(calls.length).toBeGreaterThan(0);
      for (const args of calls) {
        expect(args).toEqual([
          expect.objectContaining({
            submissionId: expect.any(String),
            outcome: expect.any(String),
          }),
        ]);
        expect(Object.keys(args[0]).sort()).toEqual([
          "outcome",
          "submissionId",
        ]);
      }
    },
  );
});
