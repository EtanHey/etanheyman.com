import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import ContactForm from "../ContactForm";

vi.mock("../actions", () => ({ submitContactForm: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("@/app/components/ui/phone-input", () => ({ PhoneInput: () => null }));

it("bounds the visible name, email and message inputs", () => {
  const html = renderToStaticMarkup(
    createElement(ContactForm, { timingToken: "test-token" }),
  );
  for (const [name, limit] of [
    ["fullName", 100],
    ["email", 254],
    ["message", 5000],
  ]) {
    expect(
      new RegExp(
        `<(?:input|textarea)(?=[^>]*name="${name}")(?=[^>]*maxLength="${limit}")[^>]*>`,
        "i",
      ).test(html),
    ).toBe(true);
  }
});

it("keeps direct contact links available when the form has no signing token", () => {
  const html = renderToStaticMarkup(
    createElement(ContactForm, { timingToken: "" }),
  );
  expect(html).toContain('href="mailto:etan@heyman.net"');
  expect(html).toContain('href="tel:');
  expect(html).toContain("Contact Information");
});
