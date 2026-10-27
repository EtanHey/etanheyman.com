import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth/require-owner";
import AddLayout from "@/app/(portfolio)/projects/add/layout";
import EditLayout from "@/app/(portfolio)/projects/[slug]/edit/layout";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth/require-owner", () => ({ requireOwner: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

const children = "protected editor";
const layouts = [
  { path: "/projects/add", render: () => AddLayout({ children }) },
  {
    path: "/projects/example/edit",
    render: () =>
      EditLayout({ children, params: Promise.resolve({ slug: "example" }) }),
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireOwner).mockResolvedValue(false);
  vi.mocked(getServerSession).mockResolvedValue(null);
  vi.mocked(redirect).mockImplementation(() => {
    throw new Error("redirect");
  });
});
afterEach(() => vi.restoreAllMocks());

describe.each(layouts)("server editor guard: $path", ({ path, render }) => {
  it("redirects anonymous visitors before returning editor children", async () => {
    await expect(render()).rejects.toThrow("redirect");
    expect(requireOwner).toHaveBeenCalledOnce();
    const location = new URL(
      vi.mocked(redirect).mock.calls[0][0],
      "https://example.test",
    );
    expect(location.pathname).toBe("/admin");
    expect(location.searchParams.get("callbackUrl")).toBe(path);
  });
  it("redirects signed-in non-owners before returning editor children", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: "stranger@example.test" },
      expires: "2099-01-01",
    });
    await expect(render()).rejects.toThrow("redirect");
    expect(requireOwner).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledExactlyOnceWith("/unauthorized");
  });
  it("returns editor children for the owner", async () => {
    vi.mocked(requireOwner).mockResolvedValue(true);
    expect(await render()).toBe(children);
    expect(requireOwner).toHaveBeenCalledOnce();
    expect(redirect).not.toHaveBeenCalled();
  });
});
