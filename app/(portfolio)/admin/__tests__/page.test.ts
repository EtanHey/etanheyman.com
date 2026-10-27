import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import AdminPage from "../page";

const query = vi.hoisted(() => ({ search: "" }));
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({}),
  useSearchParams: () => new URLSearchParams(query.search),
}));

it.each([
  ["OAuthCallback", "GitHub sign-in could not be completed. Please try again."],
  ["OAuthSignin", "Could not start GitHub sign-in. Please try again."],
  ["AccessDenied", "This GitHub account is not authorized to access the admin area."],
  ["Callback", "Sign-in could not be completed. Please try again."],
  ["Configuration", "Sign-in is temporarily unavailable. Please try again later."],
])("renders a fixed message for %s", (error, message) => {
  query.search = `error=${error}`;
  const html = renderToStaticMarkup(createElement(AdminPage));
  expect(html).toContain('role="alert"');
  expect(html).toContain(message);
  expect(html).not.toContain(error);
});

it.each(["", "error="])("omits the alert for absent/empty errors: %j", (search) => {
  query.search = search;
  const html = renderToStaticMarkup(createElement(AdminPage));
  expect(html).not.toContain('role="alert"');
  expect(html).toContain("Sign in with GitHub");
});

it.each([
  "UnexpectedError",
  "Call support at +1-202-555-0100 to restore access",
  "__proto__",
  "constructor",
])(
  "uses the generic fallback without echoing unknown input: %j", (error) => {
    query.search = `error=${encodeURIComponent(error)}`;
    const html = renderToStaticMarkup(createElement(AdminPage));
    expect(html).toContain('role="alert"');
    expect(html).toContain("Sign-in failed. Please try again.");
    expect(html).not.toContain(error);
    expect(html).toContain("Sign in with GitHub");
  },
);
