import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import AdminPage from "../page";

const query = vi.hoisted(() => ({ error: "" }));
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({}),
  useSearchParams: () => new URLSearchParams({ error: query.error }),
}));

it.each(["OAuthCallback", "AccessDenied", "UnexpectedError", ""])(
  "renders the sign-in error only when present: %j", (error) => {
    query.error = error;
    const html = renderToStaticMarkup(createElement(AdminPage));
    expect(html.includes('role="alert"')).toBe(Boolean(error));
    if (error) expect(html).toContain(`Sign-in failed (${error}). Please try again.`);
    expect(html).toContain("Sign in with GitHub");
  },
);
