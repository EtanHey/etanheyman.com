import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/projects", () => ({
  getProjectBySlugOrId: vi.fn().mockResolvedValue({
    title: "Golems",
    shortDescription: "Current database description",
    description: "Long description",
  }),
  getAllProjects: vi.fn(),
}));

import { generateMetadata } from "@/app/(portfolio)/projects/[slug]/page";

describe("project metadata", () => {
  it("uses the database short description for cmuxlayer", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "cmuxlayer" }) });
    expect(metadata.description).toBe("Current database description");
  });

  it("uses the database short description for golems", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "golems" }) });
    expect(metadata.description).toBe("Current database description");
  });
});
