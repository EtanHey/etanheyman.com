import { expect, it, vi } from "vitest";
import { getAllProjects, getProjectById, getProjectBySlug, getProjectBySlugOrId, type ProjectDB } from "../projects";

const rows: ProjectDB[] = ["casona-diez-diez", "100-days-css"].map((slug, index) => ({
  id: `00000000-0000-4000-8000-00000000000${index}`, slug, title: slug,
  description: "", short_description: "", logo_path: "", logo_url: null,
  preview_image: null, technologies: [], git_url: "", live_url: null, docs_url: null,
  framework: null, featured: true, order_index: index, created_at: "", updated_at: "",
}));
vi.mock("../supabase/server", () => ({
  createClient: async () => ({ from: () => ({ select: () => ({
    order: async () => ({ data: rows, error: null }),
    eq: (field: "slug" | "id", value: string) => ({
      single: async () => ({ data: rows.find((row) => row[field] === value),
        error: rows.some((row) => row[field] === value) ? null : { code: "PGRST116" } }),
      order: async () => ({ data: [], error: null }),
    }),
  }) }) }),
}));

it("omits Casona while keeping 100-days-css visible", async () => {
  expect((await getAllProjects()).map((project) => project.slug)).toEqual(["100-days-css"]);
});
it.each([{ name: "slug", lookup: getProjectBySlug }, { name: "slug-or-ID", lookup: getProjectBySlugOrId }])("hides Casona by slug via $name", async ({ lookup }) => {
  expect(await lookup("casona-diez-diez")).toBeNull();
});
it.each([{ name: "ID", lookup: getProjectById }, { name: "slug-or-ID", lookup: getProjectBySlugOrId }])("hides Casona's UUID alias via $name", async ({ lookup }) => {
  expect(await lookup(rows[0].id)).toBeNull();
});
it("keeps other projects accessible by slug and UUID", async () => {
  expect(await getProjectBySlug("100-days-css")).toMatchObject({ slug: "100-days-css" });
  expect(await getProjectById(rows[1].id)).toMatchObject({ slug: "100-days-css" });
});
