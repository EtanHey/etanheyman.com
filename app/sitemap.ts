import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import skillsManifest from "./(golems)/golems/lib/skills-manifest.json";

const SITE_URL = "https://www.etanheyman.com";

/**
 * Slugs that always have a project detail page, even if Supabase is
 * unreachable at build time (these are the hand-built showcase pages —
 * see app/(portfolio)/projects/[slug]/page.tsx generateStaticParams).
 */
const SHOWCASE_SLUGS = [
  "brainlayer",
  "voicelayer",
  "cmuxlayer",
  "whatsapp-mcp",
  "golems",
] as const;

/** Sub-routes that only exist for the showcase / mini-site projects. */
const SHOWCASE_SUBROUTES = ["architecture", "docs", "features"] as const;

const DOCS_CONTENT_DIR = join(process.cwd(), "content", "golems");

function collectDocSlugs(dir: string, prefix = ""): string[] {
  const paths: string[] = [];
  if (!existsSync(dir)) return paths;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      if (entry === "_archived") continue;
      paths.push(...collectDocSlugs(full, rel));
    } else if (entry.endsWith(".md")) {
      paths.push(rel.replace(/\.md$/, ""));
    }
  }
  return paths;
}

async function projectSlugs(): Promise<string[]> {
  try {
    const projects = await getAllProjects();
    const slugs = projects
      .map((p) => p.slug)
      .filter((s): s is string => Boolean(s));
    if (slugs.length === 0) return [...SHOWCASE_SLUGS];
    return Array.from(new Set([...SHOWCASE_SLUGS, ...slugs]));
  } catch {
    // Supabase unavailable at build time — still ship the showcase pages.
    return [...SHOWCASE_SLUGS];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const push = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => {
    entries.push({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    });
  };

  // Core portfolio routes
  push("/", 1.0, "weekly");
  push("/about", 0.9, "monthly");
  push("/projects", 0.9, "weekly");
  push("/contact", 0.7, "yearly");

  // Resume PDF — the most-indexed artifact on the domain.
  entries.push({
    url: `${SITE_URL}/Etan_Heyman_resume.pdf`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  });

  // Agent-facing manifest
  entries.push({
    url: `${SITE_URL}/llms.txt`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  });

  // Project detail pages
  const slugs = await projectSlugs();
  for (const slug of slugs) {
    push(`/projects/${slug}`, 0.8, "monthly");
  }

  // Mini-site sub-routes (only the showcase projects render these)
  for (const slug of SHOWCASE_SLUGS) {
    for (const sub of SHOWCASE_SUBROUTES) {
      push(`/projects/${slug}/${sub}`, 0.6, "monthly");
    }
  }

  // Golems section
  push("/golems", 0.8, "weekly");
  push("/golems/skills", 0.7, "weekly");

  for (const name of Object.keys(skillsManifest.skills ?? {})) {
    push(`/golems/skills/${name}`, 0.5, "monthly");
  }

  for (const docSlug of collectDocSlugs(DOCS_CONTENT_DIR)) {
    push(`/golems/docs/${docSlug}`, 0.5, "monthly");
  }

  return entries;
}
