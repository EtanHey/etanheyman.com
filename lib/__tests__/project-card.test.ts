import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/projects";
import {
  DEFAULT_CARD_ACCENT_RGB,
  deriveProjectCard,
  getProjectMonogram,
  splitProjectTitle,
} from "@/lib/project-card";
import { getProjectShowcaseConfig } from "@/app/(portfolio)/projects/[slug]/project-showcase-config";

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "plain-project",
    title: "Plain Project",
    description: "A longer description.",
    shortDescription: "A short description.",
    logoPath: "",
    logoUrl: null,
    previewImage: null,
    technologies: [],
    gitUrl: "https://github.com/EtanHey/plain",
    liveUrl: null,
    docsUrl: null,
    framework: null,
    featured: false,
    orderIndex: 1,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    ...overrides,
  };
}

describe("splitProjectTitle", () => {
  it("splits on an em dash into name and subtitle", () => {
    expect(splitProjectTitle("BrainLayer — Persistent Memory for AI Agents")).toEqual({
      name: "BrainLayer",
      subtitle: "Persistent Memory for AI Agents",
    });
  });

  it("splits on a spaced hyphen", () => {
    expect(splitProjectTitle("Cantaloupe AI - Recruitment Platform")).toEqual({
      name: "Cantaloupe AI",
      subtitle: "Recruitment Platform",
    });
  });

  it("leaves unspaced hyphens and plain titles whole", () => {
    expect(splitProjectTitle("Hebrew-Compatible Fork")).toEqual({
      name: "Hebrew-Compatible Fork",
      subtitle: null,
    });
    expect(splitProjectTitle("Casona diez diez")).toEqual({
      name: "Casona diez diez",
      subtitle: null,
    });
  });
});

describe("getProjectMonogram", () => {
  it("uses the first letters of the first two words", () => {
    expect(getProjectMonogram("WhatsApp MCP")).toBe("WM");
    expect(getProjectMonogram("Real Estate Intelligence Platform")).toBe("RE");
  });

  it("falls back to one letter for single words", () => {
    expect(getProjectMonogram("songscript")).toBe("S");
  });
});

describe("deriveProjectCard media", () => {
  it("treats SVG or #svg/#logo previews as marks with the hash stripped", () => {
    const card = deriveProjectCard(
      makeProject({ previewImage: "https://utfs.io/f/abc#svg" }),
      null,
    );
    expect(card.media).toEqual({ kind: "mark", src: "https://utfs.io/f/abc" });

    const logo = deriveProjectCard(
      makeProject({ previewImage: "/images/projects/hand.svg" }),
      null,
    );
    expect(logo.media).toEqual({ kind: "mark", src: "/images/projects/hand.svg" });
  });

  it("treats raster previews as tiles that fill the plate", () => {
    const card = deriveProjectCard(
      makeProject({ previewImage: "https://utfs.io/f/raster" }),
      null,
    );
    expect(card.media).toEqual({ kind: "tile", src: "https://utfs.io/f/raster" });
  });

  it("falls back to the logo when there is no preview", () => {
    const card = deriveProjectCard(
      makeProject({ logoUrl: "/logos/brainlayer.svg" }),
      null,
    );
    expect(card.media).toEqual({ kind: "mark", src: "/logos/brainlayer.svg" });
  });

  it("uses a monogram of the name when there is no image at all", () => {
    const card = deriveProjectCard(
      makeProject({ title: "WhatsApp MCP — Hebrew-Compatible Fork" }),
      null,
    );
    expect(card.media).toEqual({ kind: "monogram", text: "WM" });
  });
});

describe("deriveProjectCard signals", () => {
  it("shows the first technologies with an overflow count for plain projects", () => {
    const card = deriveProjectCard(
      makeProject({
        technologies: ["Next.js", "React", "TypeScript", "Tailwind", "Supabase"],
      }),
      null,
    );
    expect(card.signals).toEqual({
      kind: "stack",
      items: ["Next.js", "React", "TypeScript"],
      overflow: 2,
    });
  });

  it("shows the first two curated stats for showcase projects", () => {
    const card = deriveProjectCard(makeProject({ slug: "x" }), {
      accentRgb: "99, 102, 241",
      stats: [
        { value: 284, suffix: "K+", label: "Indexed chunks" },
        { value: 5.4, suffix: "K", label: "Upstream stars" },
        { value: 1415, label: "Tests passing" },
      ],
    });
    expect(card.signals).toEqual({
      kind: "stats",
      stats: [
        { value: 284, prefix: "", suffix: "K+", label: "Indexed chunks", decimals: 0 },
        { value: 5.4, prefix: "", suffix: "K", label: "Upstream stars", decimals: 1 },
      ],
    });
  });

  it("falls back to the stack when a showcase has no stats", () => {
    const card = deriveProjectCard(makeProject({ technologies: ["Go"] }), {
      accentRgb: "1, 2, 3",
      stats: [],
    });
    expect(card.signals).toEqual({ kind: "stack", items: ["Go"], overflow: 0 });
  });
});

describe("deriveProjectCard accent", () => {
  // AIDEV-NOTE: the old keyword heuristic labelled sky "emerald" and slate
  // "amber". Accents now come from the showcase config (same colour as the
  // detail page); everything else uses the portfolio's blue-200.
  it("uses blue-200 for projects without a showcase", () => {
    expect(deriveProjectCard(makeProject(), null).accentRgb).toBe(
      DEFAULT_CARD_ACCENT_RGB,
    );
    expect(DEFAULT_CARD_ACCENT_RGB).toBe("136, 207, 248");
  });

  it("matches the detail-page accent for showcase projects", () => {
    for (const slug of ["brainlayer", "voicelayer", "cmuxlayer", "whatsapp-mcp", "golems"]) {
      const config = getProjectShowcaseConfig(slug);
      expect(config).not.toBeNull();
      const card = deriveProjectCard(makeProject({ slug }), {
        accentRgb: config!.accent.colorRgb,
        stats: config!.stats,
      });
      expect(card.accentRgb).toBe(config!.accent.colorRgb);
      expect(card.signals.kind).toBe("stats");
    }
  });
});

describe("deriveProjectCard links and identity", () => {
  it("links by slug, falling back to id", () => {
    expect(deriveProjectCard(makeProject(), null).href).toBe("/projects/plain-project");
    expect(deriveProjectCard(makeProject({ slug: null }), null).href).toBe(
      "/projects/00000000-0000-0000-0000-000000000001",
    );
  });

  it("reports live, source and docs availability, hiding private source", () => {
    expect(
      deriveProjectCard(
        makeProject({ liveUrl: "https://x.dev", docsUrl: "https://docs.x.dev" }),
        null,
      ).links,
    ).toEqual({ live: true, source: true, docs: true });
    expect(deriveProjectCard(makeProject({ gitUrl: "private" }), null).links).toEqual({
      live: false,
      source: false,
      docs: false,
    });
  });

  it("prefers the short description for the summary", () => {
    expect(deriveProjectCard(makeProject(), null).summary).toBe("A short description.");
    expect(
      deriveProjectCard(makeProject({ shortDescription: "" }), null).summary,
    ).toBe("A longer description.");
  });
});
