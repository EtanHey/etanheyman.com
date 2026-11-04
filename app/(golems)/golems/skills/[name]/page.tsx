import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import CommandBlock from "../../components/CommandBlock";
import CopyButton from "../../components/CopyButton";
import { golemsMdxComponents } from "../../lib/golems-mdx";
import { formatDay } from "../../lib/skill-evidence";
import SkillPageTabs from "./SkillPageTabs";
import OverviewCollapsible from "./OverviewCollapsible";
import EvalStatusPanel from "./EvalStatusPanel";
import skillsManifest from "../../lib/skills-manifest.json";

interface SkillEvalEntry {
  name: string;
}

interface SkillData {
  name: string;
  command: string;
  description: string;
  category: string;
  content: string;
  evalCount: number;
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
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, max);
}

/* ── Install ─────────────────────────────────────────────── */

// AIDEV-NOTE: Matches content/golems/getting-started.md: skills install from a
// golems checkout through packages/golem-skills. There is no published global
// "golems-cli skills install" binary, so the page no longer shows one.
function getInstallLines(skill: SkillData): string[] {
  return [`bun packages/golem-skills/src/index.ts skills install ${skill.name}`];
}

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

  const relativeTime = getRelativeTime(skill.lastModified);
  const relatedSkills = getRelatedSkills(skill, skills, 3);
  const installLines = getInstallLines(skill);
  const installPrompt = getInstallPrompt(skill);
  const sourceUrl = `https://github.com/EtanHey/golems/tree/master/skills/golem-powers/${skill.name}`;

  // Strip first H1 + LLM-directive sections for Overview tab
  const overviewSource = stripLLMSections(
    skill.content.replace(/^#\s+.+\n?/m, ""),
  );
  // Split overview into summary (first 3 sections) + rest for progressive disclosure
  const { summary: overviewSummary, rest: overviewRest } =
    splitOverviewContent(overviewSource);
  // Full content for SKILL.md tab (just strip first H1)
  const rawSource = skill.content.replace(/^#\s+.+\n?/m, "");

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

  const overviewMdx = (
    <OverviewCollapsible
      summary={<MDXRemote source={overviewSummary} components={golemsMdxComponents} options={mdxOpts} />}
      rest={overviewRest ? <MDXRemote source={overviewRest} components={golemsMdxComponents} options={mdxOpts} /> : null}
      hasMore={!!overviewRest}
    />
  );

  const rawMdx = (
    <div>
      <p className="mb-6 rounded-lg bg-g-raised px-4 py-3 text-[0.95rem] leading-relaxed text-g-ash">
        The full SKILL.md, including the agent-facing directives and
        anti-patterns that the Overview leaves out.
      </p>
      <MDXRemote source={rawSource} components={golemsMdxComponents} options={mdxOpts} />
    </div>
  );

  const evalContent = (
    <div className="max-w-2xl">
      <EvalStatusPanel evalCount={skill.evalCount} hasFixtures={skill.hasFixtures} />
      <p className="mt-6 text-[0.98rem] leading-relaxed text-g-ash">
        Written scenarios describe the prompts and behaviour this skill is
        checked against. They are not results. A score appears here only after
        a run records the model that produced it.{" "}
        <Link href="/golems#ladder-heading" className="g-link">
          How a skill earns a score
        </Link>
      </p>
      {skill.evalCount > 0 && (
        <p className="mt-4 text-[0.98rem]">
          <a href={`${sourceUrl}/evals`} className="g-link" target="_blank" rel="noopener noreferrer">
            Read the scenarios on GitHub
          </a>
        </p>
      )}
    </div>
  );

  // Facts only: everything here is read from the generated manifest.
  const recordContent = (
    <div className="max-w-2xl">
    <dl className=" divide-y divide-g-rule border-y border-g-rule text-[0.98rem]">
      {[
        ["Last changed", `${formatDay(skill.lastModified)} (${relativeTime})`],
        ["Category", skill.category],
        ["Eval scenarios", skill.evalCount > 0 ? String(skill.evalCount) : "None yet"],
        ["Fixtures", skill.hasFixtures ? "Included" : "None"],
        ["Workflows", skill.workflows.length > 0 ? skill.workflows.join(", ") : "None"],
      ].map(([term, value]) => (
        <div key={term} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr]">
          <dt className="text-g-ash">{term}</dt>
          <dd className="text-g-ink">{value}</dd>
        </div>
      ))}
    </dl>
      <p className="mt-4 text-[0.98rem]">
        <a href={`https://github.com/EtanHey/golems/commits/master/skills/golem-powers/${skill.name}`} className="g-link" target="_blank" rel="noopener noreferrer">
          Full change history on GitHub
        </a>
      </p>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-6 pb-20 md:px-6 md:pt-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/golems/skills"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-[0.95rem] text-g-ash transition-colors duration-150 hover:text-g-ink"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Skill ledger
        </Link>
        <a
          href={sourceUrl}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-[0.95rem] text-g-ash transition-colors duration-150 hover:text-g-ink"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source on GitHub
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      <header className="mb-10 grid gap-8 border-b border-g-ink pb-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        <div className="min-w-0">
          <p className="text-[0.95rem] text-g-ash">{skill.category} skill</p>
          <h1 className="mt-2 font-g-mono text-[2.2rem] leading-tight font-medium break-words text-g-ink md:text-[3rem]">
            {skill.command}
          </h1>
          <p className="mt-4 max-w-[60ch] text-[1.08rem] leading-relaxed text-g-ink">
            {skill.description}
          </p>
          <p className="mt-3 text-[0.95rem] text-g-ash">
            Changed {relativeTime}
            {skill.workflows.length > 0 && (
              <>
                , ships {skill.workflows.length} workflow{skill.workflows.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
          <div className="mt-6 max-w-xl">
            <p className="mb-2 text-sm text-g-ash">Install from a golems checkout</p>
            <CommandBlock lines={installLines} label={`Install ${skill.name}`} />
          </div>
        </div>
        <div className="lg:self-start">
          <EvalStatusPanel evalCount={skill.evalCount} hasFixtures={skill.hasFixtures} compact />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <SkillPageTabs
            overviewContent={overviewMdx}
            rawContent={rawMdx}
            evalContent={evalContent}
            recordContent={recordContent}
          />

          {skill.workflows.length > 0 && (
            <section aria-labelledby="workflows-heading" className="mt-14 border-t border-g-rule pt-8">
              <h2 id="workflows-heading" className="mb-4 font-g-display text-[1.5rem] text-g-ink">
                Workflows
              </h2>
              <ul className="flex flex-wrap gap-2">
                {skill.workflows.map((w) => (
                  <li
                    key={w}
                    className="rounded-md border border-g-edge px-3 py-1.5 font-g-mono text-[0.88rem] text-g-ink"
                  >
                    {skill.command}:{w}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside aria-label="Install and related skills">
          <div className="space-y-8 lg:sticky lg:top-24">
            <section aria-labelledby="prompt-heading">
              <h2 id="prompt-heading" className="font-g-display text-[1.2rem] text-g-ink">
                Or ask your agent
              </h2>
              <p className="mt-1.5 mb-3 text-[0.92rem] leading-relaxed text-g-ash">
                Paste this into a Claude Code session.
              </p>
              <div className="g-on-kiln relative rounded-lg bg-g-kiln">
                <pre
                  className="scrollbar-thin max-h-48 overflow-auto py-3 pr-11 pl-3.5 font-g-mono text-[0.76rem] leading-relaxed whitespace-pre-wrap text-g-kiln-text [overflow-wrap:anywhere]"
                  aria-label="Install prompt for Claude Code"
                  tabIndex={0}
                >
                  {installPrompt}
                </pre>
                <CopyButton text={installPrompt} label="Copy install prompt" />
              </div>
            </section>

            {relatedSkills.length > 0 && (
              <section aria-labelledby="related-heading">
                <h2 id="related-heading" className="mb-2 font-g-display text-[1.2rem] text-g-ink">
                  More in {skill.category}
                </h2>
                <ul className="divide-y divide-g-rule border-y border-g-rule">
                  {relatedSkills.map((rs) => (
                    <li key={rs.name}>
                      <Link
                        href={`/golems/skills/${rs.name}`}
                        className="group block py-3 transition-colors duration-150 hover:bg-g-raised/70"
                      >
                        <span className="font-g-mono text-[0.9rem] font-medium text-g-cobalt underline decoration-transparent underline-offset-4 group-hover:decoration-current">
                          {rs.command}
                        </span>
                        <span className="mt-1 line-clamp-2 block text-[0.88rem] leading-snug text-g-ash">
                          {rs.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
