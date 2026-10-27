import { createHmac } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
import Contact, { dynamic } from "../page";
vi.mock("../ContactForm", () => ({ default: () => null }));
vi.mock("../actions", () => ({ submitContactForm: vi.fn() }));
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

it("server-renders a fresh signed token on every request", () => {
  vi.useFakeTimers();
  vi.setSystemTime(1_800_000_000_000);
  vi.stubEnv("NEXTAUTH_SECRET", "contact-test-secret-not-production");
  expect(dynamic).toBe("force-dynamic");
  for (let i = 0; i < 2; i++) {
    const issuedAt = String(Date.now());
    const signature = createHmac("sha256", "contact-test-secret-not-production")
      .update(`contact:${issuedAt}`)
      .digest("hex");
    expect(Contact().props.timingToken).toBe(`${issuedAt}.${signature}`);
    vi.advanceTimersByTime(1000);
  }
});
