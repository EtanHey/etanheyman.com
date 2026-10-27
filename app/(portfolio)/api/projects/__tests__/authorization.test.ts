import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getServerSession } from "next-auth";
import { GET, POST } from "../route";
import { DELETE, GET as GET_BY_ID, PATCH } from "../[id]/route";

const { createClient, query } = vi.hoisted(() => {
  const query = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn(),
  };
  return { createClient: vi.fn().mockResolvedValue(query), query };
});
vi.mock("@/lib/supabase/server", () => ({ createClient }));
vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));

const id = "12345678-1234-4abc-8abc-123456789abc";
const project = { id, title: "Example project", technologies: [] };
const owner = { user: { githubUsername: "owner" }, expires: "2099-01-01" };
const mutations = [
  { method: "POST", run: (req: Request, _id: string) => POST(req) },
  {
    method: "PATCH",
    run: (req: Request, id: string) =>
      PATCH(req, { params: Promise.resolve({ id }) }),
  },
  {
    method: "DELETE",
    run: (req: Request, id: string) =>
      DELETE(req, { params: Promise.resolve({ id }) }),
  },
];
function request(method: string) {
  return new Request(`http://localhost/api/projects/${id}`, {
    method,
    body: JSON.stringify({ title: project.title }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("ALLOWED_EMAILS", "");
  vi.stubEnv("ALLOWED_GITHUB_USERNAMES", "owner");
  vi.mocked(getServerSession).mockResolvedValue(owner);
  query.single.mockResolvedValue({ data: project, error: null });
  query.order.mockResolvedValue({ data: [], error: null });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe.each(mutations)("$method owner authorization", ({ method, run }) => {
  it.each([
    null,
    {
      user: { githubUsername: "stranger", email: "stranger@example.test" },
      expires: "2099-01-01",
    },
  ])(
    "denies anonymous and non-owner sessions before body or Supabase access: %j",
    async (session) => {
      vi.mocked(getServerSession).mockResolvedValue(session);
      const req = request(method);
      const parse = vi.spyOn(req, "json");
      expect((await run(req, id)).status).toBe(403);
      expect(parse).not.toHaveBeenCalled();
      expect(createClient).not.toHaveBeenCalled();
      expect(query.from).not.toHaveBeenCalled();
    },
  );
  it("fails closed for existing sessions when both allowlists are empty", async () => {
    vi.stubEnv("ALLOWED_GITHUB_USERNAMES", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await run(request(method), id)).status).toBe(403);
    expect(createClient).not.toHaveBeenCalled();
  });
  it("lets owners reach the Supabase mutation", async () => {
    const response = await run(request(method), id);
    expect(response.status).toBe(
      method === "POST" ? 201 : method === "PATCH" ? 200 : 204,
    );
    expect(createClient).toHaveBeenCalledOnce();
    expect(query.from).toHaveBeenCalledWith("projects");
    if (method === "POST")
      expect(query.insert).toHaveBeenCalledWith({ title: project.title });
    if (method === "PATCH")
      expect(query.update).toHaveBeenCalledWith({ title: project.title });
    if (method === "DELETE") expect(query.delete).toHaveBeenCalledOnce();
    if (method !== "POST") expect(query.eq).toHaveBeenCalledWith("id", id);
  });
});

describe.each(mutations.slice(1))(
  "$method UUID validation",
  ({ method, run }) => {
    it.each([
      "not-a-uuid",
      "",
      `${id}extra`,
      "12345678-1234-4abc-8abc-123456789abz",
    ])("rejects %j before body or Supabase access", async (badId) => {
      const req = request(method);
      const parse = vi.spyOn(req, "json");
      expect((await run(req, badId)).status).toBe(400);
      expect(parse).not.toHaveBeenCalled();
      expect(createClient).not.toHaveBeenCalled();
    });
    it("accepts an uppercase UUID", async () => {
      expect((await run(request(method), id.toUpperCase())).status).toBe(
        method === "PATCH" ? 200 : 204,
      );
      expect(query.eq).toHaveBeenCalledWith("id", id.toUpperCase());
    });
    it("checks owner authorization before UUID validation", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      expect((await run(request(method), "invalid")).status).toBe(403);
      expect(createClient).not.toHaveBeenCalled();
    });
  },
);

it("keeps collection and individual project GET public", async () => {
  vi.mocked(getServerSession).mockResolvedValue(null);
  expect((await GET()).status).toBe(200);
  expect(
    (
      await GET_BY_ID(new Request(`http://localhost/api/projects/${id}`), {
        params: Promise.resolve({ id }),
      })
    ).status,
  ).toBe(200);
  expect(getServerSession).not.toHaveBeenCalled();
});
