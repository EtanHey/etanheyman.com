import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { useMDXComponents } from "@/mdx-components";
import CopyButton from "../../components/CopyButton";
import MermaidDiagram from "../../components/MermaidDiagram";
import SkillPageTabs from "./SkillPageTabs";
import OverviewCollapsible from "./OverviewCollapsible";
import EvalDashboard from "./EvalDashboard";
import skillsManifest from "../../lib/skills-manifest.json";
import { generateEvalResult } from "../../lib/eval-data";

interface SkillEvalEntry {
  name: string;
  assertionCount: number;
  assertions: string[];
}

interface SkillData {
  name: string;
  command: string;
  description: string;
  category: string;
  content: string;
  evalCount: number;
  assertionCount: number;
  hasFixtures: boolean;
  evals: SkillEvalEntry[];
  workflows: string[];
  lastModified: string;
}

const skills = skillsManifest.skills as Record<string, SkillData>;

export function generateStaticParams() {
  return Object.keys(skills).map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const skill = skills[name];
  if (!skill) return { title: "Skill Not Found" };
  return {
    title: `${skill.command} — Golem Skill`,
    description: skill.description,
  };
}

/* ── Helpers ──────────────────────────────────────────────── */

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    const el = node as React.ReactElement<{ children?: React.ReactNode }>;
    return extractTextContent(el.props.children);
  }
  return "";
}

/** Strip LLM-directive sections (CARDINAL RULE, ANTI-PATTERNS, etc.) for human-friendly Overview */
function stripLLMSections(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let skip = false;
  let skipDepth = 0;

  const LLM_KEYWORDS = [
    "CARDINAL RULE",
    "ANTI-PATTERN",
    "IMPORTANT INSTRUCTION",
    "HARD-GATE",
    "MANDATORY",
    "RED FLAG",
    "EXTREMELY IMPORTANT",
    "EXTREMELY-IMPORTANT",
  ];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const depth = headingMatch[1].length;
      const title = headingMatch[2].toUpperCase();

      if (LLM_KEYWORDS.some((kw) => title.includes(kw))) {
        skip = true;
        skipDepth = depth;
        continue;
      }

      if (skip && depth <= skipDepth) {
        skip = false;
      }
    }

    if (!skip) {
      result.push(line);
    }
  }

  return result.join("\n");
}

/** Split markdown into summary (first N ## sections) and the rest */
function splitOverviewContent(
  content: string,
  maxSections = 3,
): { summary: string; rest: string } {
  const lines = content.split("\n");
  let sectionCount = 0;
  let splitIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      sectionCount++;
      if (sectionCount > maxSections) {
        splitIndex = i;
        break;
      }
    }
  }

  if (splitIndex === -1) {
    return { summary: content, rest: "" };
  }

  return {
    summary: lines.slice(0, splitIndex).join("\n").trimEnd(),
    rest: lines.slice(splitIndex).join("\n"),
  };
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(diffDays / 30);
  if (diffDays < 365) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

function getRelatedSkills(
  currentSkill: SkillData,
  allSkills: Record<string, SkillData>,
  max = 3,
): SkillData[] {
  return Object.values(allSkills)
    .filter(
      (s) =>
        s.name !== currentSkill.name && s.category === currentSkill.category,
    )
    .sort((a, b) => b.assertionCount - a.assertionCount)
    .slice(0, max);
}

/* ── Category badge colors ─────────────────────────────────── */

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Development: { bg: "bg-[#6ab0f318]", text: "text-[#6ab0f3]" },
  Operations: { bg: "bg-[#e5950018]", text: "text-[#e59500]" },
  "Research & Context": { bg: "bg-[#40d4d418]", text: "text-[#40d4d4]" },
  "Content & Communication": { bg: "bg-[#c084fc18]", text: "text-[#c084fc]" },
  Quality: { bg: "bg-[#28c84018]", text: "text-[#28c840]" },
  Domain: { bg: "bg-[#ff7eb318]", text: "text-[#ff7eb3]" },
  Other: { bg: "bg-[#a8907818]", text: "text-[#b0a89c]" },
};

/* ── Install prompt ──────────────────────────────────────── */

function getInstallPrompt(skill: SkillData): string {
  return `Install and configure the ${skill.name} skill for Claude Code.
Download from github.com/EtanHey/golems/tree/master/skills/golem-powers/${skill.name}
and symlink to ~/.claude/commands/${skill.name}/. If ~/.golems/config.yaml
doesn't exist, run the setup wizard first. Then follow the First-Time
Setup section in the SKILL.md.`;
}

/* ── Page ──────────────────────────────────────────────────── */

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const skill = skills[name];
  if (!skill) notFound();

  const catColors = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Other;
  const relativeTime = getRelativeTime(skill.lastModified);
  const relatedSkills = getRelatedSkills(skill, skills, 3);
  const installCommand = `golems-cli skills install ${skill.name}`;
  const installPrompt = getInstallPrompt(skill);

  // Strip first H1 + LLM-directive sections for Overview tab
  const overviewSource = stripLLMSections(
    skill.content.replace(/^#\s+.+\n?/m, ""),
  );
  // Split overview into summary (first 3 sections) + rest for progressive disclosure
  const { summary: overviewSummary, rest: overviewRest } =
    splitOverviewContent(overviewSource);
  // Full content for SKILL.md tab (just strip first H1)
  const rawSource = skill.content.replace(/^#\s+.+\n?/m, "");

  const baseComponents = useMDXComponents({});
  const components = {
    ...baseComponents,
    pre: ({
      children,
      ...props
    }: React.ComponentPropsWithoutRef<"pre"> & {
      children?: React.ReactNode;
      "data-language"?: string;
    }) => {
      const child = children as
        | React.ReactElement<{
            className?: string;
            children?: React.ReactNode;
          }>
        | undefined;
      const lang =
        props["data-language"] ||
        child?.props?.className?.replace("language-", "");
      if (lang === "mermaid") {
        const chart = extractTextContent(children);
        return <MermaidDiagram chart={chart} />;
      }
      const codeText = extractTextContent(children);
      return (
        <div className="group relative mb-4">
          <pre
            className="scrollbar-thin overflow-x-auto rounded-lg border border-[#e5950026] bg-[#0d0d0d] p-4 text-sm [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[inherit]"
            style={{
              fontFamily:
                "var(--font-golems-mono), 'JetBrains Mono', 'Fira Code', monospace",
            }}
            {...props}
          >
            {children}
          </pre>
          {codeText.trim() && <CopyButton text={codeText} />}
        </div>
      );
    },
  };

  // Pre-render MDX for both tabs (server-rendered, toggled via CSS on client)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- rehype plugin tuple types
  const mdxOpts: any = {
    mdxOptions: {
      format: "md",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          { theme: "github-dark-dimmed", keepBackground: false },
        ],
      ],
    },
  };

  const summaryMdx = (
    <MDXRemote
      source={overviewSummary}
      components={components}
      options={mdxOpts}
    />
  );

  const restMdx = overviewRest ? (
    <MDXRemote
      source={overviewRest}
      components={components}
      options={mdxOpts}
    />
  ) : null;

  const overviewMdx = (
    <OverviewCollapsible
      summary={summaryMdx}
      rest={restMdx}
      hasMore={!!overviewRest}
    />
  );

  const rawMdx = (
    <div>
      <div className="mb-4 rounded-lg border border-[#e5950020] bg-[#e5950008] px-4 py-2.5">
        <p className="text-xs text-[#b0a89c]">
          Full SKILL.md source — includes LLM directives, anti-patterns, and
          technical instructions stripped from the Overview tab.
        </p>
      </div>
      <div className="rounded-xl border border-[#e5950015] bg-[#0d0c0a] p-5">
        <MDXRemote
          source={rawSource}
          components={components}
          options={{
            mdxOptions: {
              format: "md",
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [
                  rehypePrettyCode,
                  { theme: "github-dark-dimmed", keepBackground: false },
                ],
              ],
            },
          }}
        />
      </div>
    </div>
  );

  // Generate per-model eval data from skill assertions
  const allAssertions = skill.evals.flatMap((e) => e.assertions);
  const evalData = generateEvalResult({
    name: skill.name,
    assertionCount: skill.assertionCount,
    assertions: allAssertions,
    evalCount: skill.evalCount,
  });

  const evalResults = evalData ? <EvalDashboard data={evalData} /> : null;

  // Build changelog content (data-driven from eval dates + skill metadata)
  const changelogContent =
    evalData || skill.lastModified ? (
      <div className="space-y-0">
        <div className="mb-4 rounded-lg border border-[#e5950020] bg-[#e5950008] px-4 py-2.5">
          <p className="text-xs text-[#b0a89c]">
            Changelog entries are derived from eval runs and skill version
            updates. Full cascading changelog (Phase 4D) coming soon.
          </p>
        </div>
        <div className="relative border-l-2 border-[#e5950020] pl-6">
          {/* Eval milestone entry */}
          {evalData && (
            <div className="group relative mb-8">
              <div className="absolute top-1 -left-[1.4rem] h-3 w-3 rounded-full border-2 border-[#28c840] bg-[#0c0b0a]" />
              <div className="mb-1 flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#28c840]">
                  Eval Run
                </span>
                <span className="text-xs text-[#b0a89c]">
                  {evalData.lastEvalDate}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                    evalData.source === "real"
                      ? "bg-[#28c84015] text-[#28c840]"
                      : "bg-[#e5950015] text-[#e59500]"
                  }`}
                >
                  {evalData.source === "real" ? "real data" : "mock"}
                </span>
              </div>
              <div className="rounded-lg border border-[#e5950014] bg-[#14120e]/80 p-4">
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <p className="text-[0.65rem] font-medium tracking-wider text-[#b0a89c] uppercase">
                      Best Pass Rate
                    </p>
                    <p className="mt-0.5 font-mono text-lg font-bold text-[#28c840]">
                      {Math.round(evalData.bestPassRate * 100)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-medium tracking-wider text-[#b0a89c] uppercase">
                      Assertions
                    </p>
                    <p className="mt-0.5 font-mono text-lg font-bold text-[#6ab0f3]">
                      {evalData.assertions.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-medium tracking-wider text-[#b0a89c] uppercase">
                      Models Tested
                    </p>
                    <p className="mt-0.5 font-mono text-lg font-bold text-[#c084fc]">
                      {evalData.models.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-medium tracking-wider text-[#b0a89c] uppercase">
                      Evals Run
                    </p>
                    <p className="mt-0.5 font-mono text-lg font-bold text-[#e59500]">
                      {skill.evalCount}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {evalData.models.map((m) => (
                    <div key={m.model} className="flex items-center gap-2">
                      <span className="w-2 text-xs text-[#28c840]">✓</span>
                      <span className="font-mono text-xs text-[#c0b8a8]">
                        {m.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#28c840]">
                        {Math.round(m.passRate * 100)}%
                      </span>
                      <span className="text-xs text-[#b0a89c]">
                        ({m.passed}/{m.total} assertions)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Initial publish entry */}
          <div className="relative mb-8">
            <div className="absolute top-1 -left-[1.4rem] h-3 w-3 rounded-full border-2 border-[#e59500] bg-[#0c0b0a]" />
            <div className="mb-1 flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#e59500]">
                v1.0 — Last Updated
              </span>
              <span className="text-xs text-[#b0a89c]">
                {skill.lastModified}
              </span>
            </div>
            <div className="rounded-lg border border-[#e5950014] bg-[#14120e]/80 p-4">
              <ul className="space-y-1 text-xs text-[#b8ad9e]">
                <li className="flex items-start gap-2">
                  <span className="text-[#e59500]">+</span>
                  <span>Initial release to Golems skill library</span>
                </li>
                {skill.evalCount > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#e59500]">+</span>
                    <span>
                      {skill.assertionCount} assertions across {skill.evalCount}{" "}
                      eval scenario{skill.evalCount !== 1 ? "s" : ""}
                    </span>
                  </li>
                )}
                {skill.workflows.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#e59500]">+</span>
                    <span>
                      {skill.workflows.length} workflow
                      {skill.workflows.length !== 1 ? "s" : ""} included:{" "}
                      {skill.workflows.join(", ")}
                    </span>
                  </li>
                )}
                {skill.hasFixtures && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#e59500]">+</span>
                    <span>Eval fixtures included</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 md:px-6 md:pt-10">
      {/* Navigation bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/golems#skills"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-[#b0a89c] transition-colors hover:text-[#e59500]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Skills Library
        </Link>
        <a
          href={`https://github.com/EtanHey/golems/tree/master/skills/golem-powers/${skill.name}`}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-[#b0a89c] transition-colors hover:text-[#c0b8a8]"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      {/* ═══ Business Card Header ═══ */}
      <header className="mb-8">
        {/* Category badge */}
        <span
          className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${catColors.bg} ${catColors.text}`}
        >
          {skill.category}
        </span>

        {/* Skill name */}
        <h1 className="mb-2 font-mono text-3xl font-bold text-[#f0ebe0] md:text-4xl">
          {skill.command}
        </h1>

        {/* Description */}
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-[#b8ad9e]">
          {skill.description}
        </p>

        {/* Install CTA (hero element) */}
        <div className="group relative mb-6 max-w-xl">
          <div className="overflow-hidden rounded-lg border border-[#2dd4a830] bg-[#0d0d0d]">
            <div className="flex items-center px-4 py-3 pr-14">
              <code
                className="font-mono text-sm text-[#2dd4a8]"
                style={{
                  fontFamily:
                    "var(--font-golems-mono), 'JetBrains Mono', monospace",
                }}
              >
                <span className="text-[#b0a89c]">$</span> {installCommand}
              </code>
            </div>
            <CopyButton text={installCommand} />
          </div>
        </div>

        {/* Trust signal bar */}
        <div className="mb-4 flex flex-wrap gap-3">
          {evalData && (
            <div className="flex min-h-[44px] items-center gap-2 rounded-lg border border-[#28c84020] bg-[#28c84008] px-3.5 py-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#28c840]" />
              <span className="text-sm font-medium text-[#28c840]">
                {Math.round(evalData.bestPassRate * 100)}% best pass rate
              </span>
            </div>
          )}
          {skill.assertionCount > 0 && (
            <div className="flex min-h-[44px] items-center gap-2 rounded-lg border border-[#28c84020] bg-[#28c84008] px-3.5 py-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#28c840]" />
              <span className="text-sm font-medium text-[#28c840]">
                {skill.assertionCount} assertions
              </span>
            </div>
          )}
          {skill.evalCount > 0 && (
            <div className="flex min-h-[44px] items-center gap-2 rounded-lg border border-[#6ab0f320] bg-[#6ab0f308] px-3.5 py-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#6ab0f3]" />
              <span className="text-sm font-medium text-[#6ab0f3]">
                {skill.evalCount} eval{skill.evalCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {skill.hasFixtures && (
            <div className="flex min-h-[44px] items-center gap-2 rounded-lg border border-[#e5950020] bg-[#e5950008] px-3.5 py-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#e59500]" />
              <span className="text-sm font-medium text-[#e59500]">
                fixtures
              </span>
            </div>
          )}
          {skill.workflows.length > 0 && (
            <div className="flex min-h-[44px] items-center gap-2 rounded-lg border border-[#c084fc20] bg-[#c084fc08] px-3.5 py-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#c084fc]" />
              <span className="text-sm font-medium text-[#c084fc]">
                {skill.workflows.length} workflow
                {skill.workflows.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Last updated */}
        <p className="text-sm text-[#b0a89c]">Updated {relativeTime}</p>
      </header>

      {/* ═══ Two Column Layout ═══ */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        {/* Main content */}
        <main className="min-w-0">
          <SkillPageTabs
            overviewContent={overviewMdx}
            rawContent={rawMdx}
            evalContent={evalResults}
            changelogContent={changelogContent}
          />

          {/* Workflows (below tabs) */}
          {skill.workflows.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-[#f0ebe0]">
                Workflows
              </h2>
              <div className="flex flex-wrap gap-2">
                {skill.workflows.map((w) => (
                  <span
                    key={w}
                    className="rounded-lg border border-[#c084fc20] bg-[#c084fc08] px-4 py-2 font-mono text-sm text-[#c084fc]"
                  >
                    {skill.command}:{w}
                  </span>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ═══ Sidebar ═══ */}
        <aside>
          <div className="scrollbar-thin space-y-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2">
            {/* Quick Install */}
            <div className="rounded-xl border border-[#2dd4a826] bg-[#14120e]/90 p-5">
              <h3 className="mb-3 text-sm font-bold text-[#2dd4a8]">
                Quick Install
              </h3>
              <div className="group relative mb-3">
                <CopyButton text={installCommand} />
                <pre
                  className="scrollbar-none overflow-x-auto rounded-lg border border-[#2dd4a81a] bg-black/40 p-3 font-mono text-[0.75rem] leading-relaxed text-[#2dd4a8]"
                  aria-label={`Install command: ${installCommand}`}
                >
                  {installCommand}
                </pre>
              </div>
              <p className="mb-2 text-xs text-[#b0a89c]">
                Or paste into Claude Code:
              </p>
              <div className="group relative">
                <CopyButton text={installPrompt} />
                <pre
                  className="scrollbar-none max-h-32 overflow-x-auto overflow-y-auto rounded-lg border border-[#2dd4a81a] bg-black/40 p-3 font-mono text-[0.65rem] leading-relaxed text-[#2dd4a8]/80"
                  aria-label="Install prompt for Claude Code"
                >
                  {installPrompt}
                </pre>
              </div>
            </div>

            {/* Metadata */}
            <div className="rounded-xl border border-[#e5950014] bg-[#14120e]/90 p-5">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#b0a89c]">Category</dt>
                  <dd className={catColors.text}>{skill.category}</dd>
                </div>
                {skill.evalCount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[#b0a89c]">Evals</dt>
                    <dd className="text-[#c0b8a8]">{skill.evalCount}</dd>
                  </div>
                )}
                {skill.assertionCount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[#b0a89c]">Assertions</dt>
                    <dd className="font-medium text-[#28c840]">
                      {skill.assertionCount} passing
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#b0a89c]">Fixtures</dt>
                  <dd
                    className={
                      skill.hasFixtures ? "text-[#28c840]" : "text-[#b0a89c]"
                    }
                  >
                    {skill.hasFixtures ? "Included" : "None"}
                  </dd>
                </div>
                {skill.workflows.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[#b0a89c]">Workflows</dt>
                    <dd className="text-[#c0b8a8]">{skill.workflows.length}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#b0a89c]">Updated</dt>
                  <dd className="text-[#c0b8a8]">{relativeTime}</dd>
                </div>
              </dl>

              <div className="mt-4 border-t border-[#e5950014] pt-4">
                <a
                  href={`https://github.com/EtanHey/golems/tree/master/skills/golem-powers/${skill.name}`}
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-[#b0a89c] transition-colors hover:text-[#c0b8a8]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View source on GitHub
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Related Skills */}
            {relatedSkills.length > 0 && (
              <div className="rounded-xl border border-[#e5950014] bg-[#14120e]/90 p-5">
                <h3 className="mb-3 text-sm font-bold text-[#f0ebe0]">
                  Related Skills
                </h3>
                <div className="space-y-2">
                  {relatedSkills.map((rs) => (
                    <Link
                      key={rs.name}
                      href={`/golems/skills/${rs.name}`}
                      className="block rounded-lg border border-[#e5950014] p-3 no-underline transition-colors hover:border-[#e5950040] hover:bg-[#e595000a]"
                    >
                      <code className="font-mono text-xs font-bold text-[#e59500]">
                        {rs.command}
                      </code>
                      <p className="mt-1 text-[0.72rem] leading-snug text-[#b8ad9e]">
                        {rs.description.length > 80
                          ? rs.description.slice(0, 80) + "..."
                          : rs.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
