import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { useMDXComponents } from "@/mdx-components";
import CopyButton from "../../components/CopyButton";
import MermaidDiagram from "../../components/MermaidDiagram";
import skillsManifest from "../../lib/skills-manifest.json";

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
    title: `/${skill.name} — Golem Skill`,
    description: skill.description,
  };
}

/* ── Markdown helpers ──────────────────────────────────────── */

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

/* ── Category badge colors ─────────────────────────────────── */

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Development: { bg: "bg-[#6ab0f318]", text: "text-[#6ab0f3]" },
  Operations: { bg: "bg-[#e5950018]", text: "text-[#e59500]" },
  "Research & Context": { bg: "bg-[#40d4d418]", text: "text-[#40d4d4]" },
  "Content & Communication": { bg: "bg-[#c084fc18]", text: "text-[#c084fc]" },
  Quality: { bg: "bg-[#28c84018]", text: "text-[#28c840]" },
  Domain: { bg: "bg-[#ff7eb318]", text: "text-[#ff7eb3]" },
  Other: { bg: "bg-[#8b735518]", text: "text-[#8b7355]" },
};

/* ── Install prompt generator ──────────────────────────────── */

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
  const installPrompt = getInstallPrompt(skill);

  // Strip first H1 if it matches the skill name
  const strippedContent = skill.content.replace(/^#\s+.+\n?/m, "");

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
            className="scrollbar-none overflow-x-auto rounded-lg border border-[#e5950026] bg-[#0d0d0d] p-4 text-sm [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[inherit]"
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

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-16 md:px-6 md:pt-10">
      {/* Back link */}
      <Link
        href="/golems#skills"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#8b7355] transition-colors hover:text-[#e59500]"
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

      {/* Header */}
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-3xl font-bold text-[#f0ebe0] md:text-4xl">
            {skill.command}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${catColors.bg} ${catColors.text}`}
          >
            {skill.category}
          </span>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-[#908575]">
          {skill.description}
        </p>
      </header>

      {/* Trust signals */}
      <div className="mb-10 flex flex-wrap gap-3">
        {skill.evalCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-[#28c84020] bg-[#28c84008] px-3.5 py-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="text-sm font-medium text-[#28c840]">
              {skill.evalCount} evals
            </span>
          </div>
        )}
        {skill.assertionCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-[#6ab0f320] bg-[#6ab0f308] px-3.5 py-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#6ab0f3]" />
            <span className="text-sm font-medium text-[#6ab0f3]">
              {skill.assertionCount} assertions
            </span>
          </div>
        )}
        {skill.hasFixtures && (
          <div className="flex items-center gap-2 rounded-lg border border-[#e5950020] bg-[#e5950008] px-3.5 py-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#e59500]" />
            <span className="text-sm font-medium text-[#e59500]">fixtures</span>
          </div>
        )}
        {skill.workflows.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-[#c084fc20] bg-[#c084fc08] px-3.5 py-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#c084fc]" />
            <span className="text-sm font-medium text-[#c084fc]">
              {skill.workflows.length} workflows
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 rounded-lg border border-[#8b735520] bg-[#8b735508] px-3.5 py-2">
          <span className="text-sm text-[#8b7355]">
            Updated {skill.lastModified}
          </span>
        </div>
      </div>

      {/* SKILL.md content */}
      <section className="mb-12">
        <MDXRemote
          source={strippedContent}
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
      </section>

      {/* Eval Results */}
      {skill.evals.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-[#f0ebe0]">
            Eval Results
          </h2>
          <div className="overflow-hidden rounded-xl border border-[#e5950020] bg-[#14120e]/90">
            {skill.evals.map((evalItem, i) => (
              <div
                key={evalItem.name}
                className={`flex items-start gap-4 px-5 py-4 ${i > 0 ? "border-t border-[#e5950014]" : ""}`}
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-[#c0b8a8]">
                      {evalItem.name}
                    </span>
                    <span className="rounded-full bg-[#6ab0f315] px-2 py-0.5 text-[0.65rem] font-medium text-[#6ab0f3]">
                      {evalItem.assertionCount} assertions
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {evalItem.assertions.map((a) => (
                      <span
                        key={a}
                        className="rounded bg-[#28c84010] px-2 py-0.5 font-mono text-[0.65rem] text-[#28c840]/80"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Workflows */}
      {skill.workflows.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-[#f0ebe0]">Workflows</h2>
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

      {/* Install Prompt */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-[#f0ebe0]">Install</h2>
        <div className="rounded-xl border border-[#2dd4a826] bg-[#14120e]/90 p-5">
          <p className="mb-3 text-sm text-[#7c6f5e]">
            Paste this into any Claude Code session:
          </p>
          <div className="group relative">
            <CopyButton text={installPrompt} />
            <pre className="scrollbar-none overflow-x-auto rounded-lg border border-[#2dd4a81a] bg-black/40 p-4 font-mono text-sm leading-relaxed text-[#2dd4a8]">
              {installPrompt}
            </pre>
          </div>
        </div>
      </section>

      {/* Source link */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5950020] pt-6">
        <Link
          href="/golems#skills"
          className="inline-flex items-center gap-1.5 text-sm text-[#8b7355] transition-colors hover:text-[#e59500]"
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
          Back to Skills Library
        </Link>
        <a
          href={`https://github.com/EtanHey/golems/tree/master/skills/golem-powers/${skill.name}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#8b7355] transition-colors hover:text-[#c0b8a8]"
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
    </div>
  );
}
