import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import Footer from "@/app/components/Footer";

test("accessibility statement renders one main heading and a contact link", async () => {
  const { default: AccessibilityPage, metadata } = await import(
    "@/app/(portfolio)/accessibility/page"
  );
  const html = renderToStaticMarkup(createElement(AccessibilityPage));
  expect(html.match(/<h1\b/g)).toHaveLength(1);
  expect(html).toContain("Accessibility statement</h1>");
  expect(html).toContain('href="/contact"');
  expect(metadata.title).toBe("Accessibility statement | Etan Heyman");
});

test("footer offers accessibility without a dead privacy link", () => {
  const html = renderToStaticMarkup(createElement(Footer));
  expect(html).toContain('href="/accessibility"');
  expect(html).not.toContain('href="/privacy"');
});
