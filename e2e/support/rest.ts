import { createServer } from "node:http";
import type { Project, ProjectDB } from "../../lib/projects";
import snapshot from "../fixtures/projects.json";

// The inherited RSC snapshot serialized absent journey data as "$undefined".
const projects = snapshot satisfies Omit<Project, "projectJourney">[];
export const rows = projects.map(
  (p): ProjectDB => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    short_description: p.shortDescription,
    logo_path: p.logoPath,
    logo_url: p.logoUrl,
    preview_image: p.previewImage,
    technologies: p.technologies,
    git_url: p.gitUrl,
    live_url: p.liveUrl,
    docs_url: p.docsUrl,
    framework: p.framework,
    featured: p.featured,
    order_index: p.orderIndex,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }),
);

export function createFixtureServer() {
  return createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.method !== "GET") {
      res.writeHead(405, { Allow: "GET" }).end();
      return;
    }
    const url = new URL(req.url || "/", "http://127.0.0.1");
    if (
      !["/rest/v1/projects", "/rest/v1/project_journey_steps"].includes(
        url.pathname,
      )
    ) {
      res.writeHead(404).end();
      return;
    }
    let data = url.pathname.endsWith("/projects") ? [...rows] : [];
    for (const key of ["id", "slug"] as const) {
      const filter = url.searchParams.get(key);
      if (filter?.startsWith("eq."))
        data = data.filter((p) => p[key] === filter.slice(3));
    }
    data.sort(
      (a, b) => (a.order_index ?? Infinity) - (b.order_index ?? Infinity),
    );
    const single = req.headers.accept?.includes("vnd.pgrst.object");
    if (single && data.length !== 1) {
      res
        .writeHead(406)
        .end(JSON.stringify({ code: "PGRST116", message: "Expected one row" }));
      return;
    }
    res.end(JSON.stringify(single ? data[0] : data));
  });
}
