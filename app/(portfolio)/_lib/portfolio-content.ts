import type { Project } from "@/lib/projects";
import skillsManifest from "@/app/(golems)/golems/lib/skills-manifest.json";
import { skillStats } from "@/app/(golems)/golems/lib/skill-stats";

// AIDEV-NOTE: Presentation rules for the portfolio redesign. Nothing here adds a
// fact: grouping and context labels come from each row's own git URL and from the
// career timeline already on /about; claim-check status comes from the committed
// migrations; skill numbers come from the generated skills manifest.

export type WorkGroupId = "agent-tooling" | "product" | "experiments" | "more";

export const WORK_GROUPS: { id: WorkGroupId; title: string; intro: string }[] = [
  {
    id: "agent-tooling",
    title: "Open-source agent tooling",
    intro:
      "MCP servers and skills that give AI coding agents memory, a voice, and a way to work in parallel. Read the code before you read the description.",
  },
  {
    id: "product",
    title: "Product and client work",
    intro:
      "Platforms and sites built for an employer, for clients at Weby, and as course projects.",
  },
  {
    id: "experiments",
    title: "Models and experiments",
    intro: "A computer vision model, a language-learning app and a CSS practice run.",
  },
  { id: "more", title: "More projects", intro: "Everything else in the database." },
];

const GROUP_BY_SLUG: Record<string, WorkGroupId> = {
  brainlayer: "agent-tooling",
  voicelayer: "agent-tooling",
  cmuxlayer: "agent-tooling",
  "whatsapp-mcp": "agent-tooling",
  golems: "agent-tooling",
  "cantaloupe-ai": "product",
  "mayart-candles": "product",
  "casona-diez-diez": "product",
  "beili-photographer": "product",
  "sharon-fitness": "product",
  "ofektive-fitness": "product",
  "gvi-mvp": "product",
  "real-estate-platform": "product",
  "influencer-network": "product",
  "hand-sign-detection": "experiments",
  songscript: "experiments",
  "100-days-css": "experiments",
};

export function workGroupOf(project: Pick<Project, "slug">): WorkGroupId {
  return (project.slug && GROUP_BY_SLUG[project.slug]) || "more";
}

export function groupProjects(projects: Project[]) {
  return WORK_GROUPS.map((group) => ({
    ...group,
    projects: projects.filter((p) => workGroupOf(p) === group.id),
  })).filter((group) => group.projects.length > 0);
}

/** Where the work happened, read from the repository owner. */
export function contextOf(project: Pick<Project, "gitUrl" | "slug">): string {
  const url = project.gitUrl.toLowerCase();
  if (url === "private" || !url) return "Private repository";
  if (url.includes("github.com/cantaloupe-tech/")) return "At Cantaloupe AI";
  if (url.includes("github.com/webycreatorsteam/")) return "Client work at Weby";
  if (url.includes("github.com/talyaron/")) return "INT College course repository";
  if (url.includes("github.com/etanhey/"))
    return workGroupOf(project) === "agent-tooling" ? "Open source" : "Public repository";
  return "Repository";
}

/** Projects with a dedicated case-study mini-site (mirrors generateStaticParams). */
export const CASE_STUDY_SLUGS = [
  "brainlayer",
  "voicelayer",
  "cmuxlayer",
  "whatsapp-mcp",
  "golems",
] as const;

/** cmuxLayer's own case study says it is no longer maintained. */
export const RETIRED_SLUGS = new Set(["cmuxlayer"]);

// AIDEV-NOTE: Exact short descriptions from the claim-checked migrations
// (supabase/migrations/20261028_portfolio_blurbs_claim_checked.sql and
// 20261029_cmuxlayer_blurb.sql). The "checked" marker only shows when the live row
// still matches word for word, so an edited blurb silently drops back to "not yet
// checked" instead of inheriting a review it never had. Update both together.
export const CLAIM_CHECKED: Record<string, { date: string; shortDescription: string }> = {
  brainlayer: {
    date: "October 2026",
    shortDescription:
      "Persistent memory for AI agents over MCP. 16 tools, hybrid vector + full-text search and a local knowledge graph over one SQLite file. Bounded TLA+ models checked by TLC. pip install brainlayer.",
  },
  "whatsapp-mcp": {
    date: "October 2026",
    shortDescription:
      "WhatsApp MCP fork with search that works for Hebrew and other non-ASCII text, plus separate bridges for personal and business accounts. 12 MCP tools for reading and sending messages.",
  },
  golems: {
    date: "October 2026",
    shortDescription:
      "Bun monorepo of AI agent tooling: domain packages for scheduling, finance and content, plus 50+ SKILL.md workflows for coding agents, many with evals. 700+ merged PRs.",
  },
  cmuxlayer: {
    date: "October 2026",
    shortDescription:
      "An MCP server with 10 tools for running Claude, Codex, Gemini, Kiro and Cursor agents in parallel cmux panes. Sub-agents can report blockers to their parent. Contract tests run against real cmux.",
  },
};

export type ClaimStatus = { checked: true; date: string } | { checked: false };

export function claimStatusOf(project: Pick<Project, "slug" | "shortDescription">): ClaimStatus {
  const entry = project.slug ? CLAIM_CHECKED[project.slug] : undefined;
  if (entry && entry.shortDescription === project.shortDescription.trim())
    return { checked: true, date: entry.date };
  return { checked: false };
}

export type EvidenceLink = {
  kind: "source" | "live" | "docs" | "case-study";
  label: string;
  href: string;
  external: boolean;
};

function isHttp(url: string | null | undefined): url is string {
  return !!url && /^https?:\/\//i.test(url.trim());
}

/** Things a visitor can open and check for themselves, in order of usefulness. */
export function evidenceOf(project: Project): EvidenceLink[] {
  const links: EvidenceLink[] = [];
  const slug = project.slug;
  if (slug && (CASE_STUDY_SLUGS as readonly string[]).includes(slug))
    links.push({ kind: "case-study", label: "Case study", href: `/projects/${slug}`, external: false });
  if (isHttp(project.gitUrl))
    links.push({ kind: "source", label: "Source code", href: project.gitUrl, external: true });
  if (project.docsUrl) {
    const internal = project.docsUrl.startsWith("/");
    if (internal || isHttp(project.docsUrl))
      links.push({ kind: "docs", label: "Docs", href: project.docsUrl, external: !internal });
  }
  if (isHttp(project.liveUrl))
    links.push({
      kind: "live",
      label: project.liveUrl.includes("huggingface.co") ? "Model on Hugging Face" : "Live site",
      href: project.liveUrl,
      external: true,
    });
  return links;
}

/** Titles in the database carry a long subtitle; the ledger shows the name. */
export function shortTitle(title: string): string {
  return title.split(/\s[—–-]\s/)[0].trim();
}

// ---------- Skills and their eval definitions ----------

type ManifestSkill = {
  name: string;
  command: string;
  description: string;
  evalCount: number;
  assertionCount: number;
  evals: { name: string; assertions: string[] }[];
};

// Plain-language summaries of each skill's manifest description.
const FEATURED_SKILLS: { name: string; summary: string }[] = [
  { name: "never-fabricate", summary: "Read, run and verify before claiming a result, and check every surface a change touches." },
  { name: "pr-loop", summary: "Take a pull request from opened to merged: review, CI fixes, and cleanup." },
  { name: "large-plan", summary: "Plan multi-PR work in phases with dependencies and quality gates." },
  { name: "skill-creator", summary: "Create, edit and audit skills, designing the evals first." },
  { name: "cmux-agents", summary: "Spawn visible AI workers in cmux terminal panes over MCP." },
  { name: "coach", summary: "Life admin: health, habits, jobs, clients, contracts and scheduling." },
];

const ACRONYMS: Record<string, string> = { pr: "PR", prs: "PRs", mcp: "MCP", ci: "CI", kg: "KG", tla: "TLA" };

export function humanizeAssertion(id: string): string {
  const words = id.replace(/[-_]+/g, " ").trim().split(/\s+/).map((w) => ACRONYMS[w] ?? w);
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getSkillsLedger(limit = FEATURED_SKILLS.length) {
  const all = skillsManifest.skills as Record<string, ManifestSkill>;
  const featured = FEATURED_SKILLS.flatMap(({ name, summary }) => {
    const skill = all[name];
    if (!skill || skill.evalCount === 0) return [];
    const assertions = skill.evals.flatMap((e) => e.assertions).slice(0, 3);
    return [
      {
        name: skill.name,
        command: skill.command,
        summary,
        evalCount: skill.evalCount,
        assertionCount: skill.assertionCount,
        sampleAssertions: assertions.map(humanizeAssertion),
        href: `/golems/skills/${skill.name}`,
      },
    ];
  }).slice(0, limit);
  return {
    total: skillStats.count,
    withEvalSuites: skillStats.withEvalSuites,
    generatedAt: skillsManifest.generatedAt,
    featured,
  };
}
