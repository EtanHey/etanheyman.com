import type { Metadata } from "next";
import { getProjectBySlugOrId, getAllProjects } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Archive } from "lucide-react";
import {
  TechIconWrapper,
  TechIconName,
} from "@/app/components/tech-icons/TechIconWrapper";
import {
  getProjectShowcaseConfig,
  getDefaultAccent,
  isArchived,
} from "./project-showcase-config";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { CodeBlock } from "./components/CodeBlock";
import { CrossLinks } from "./components/CrossLinks";
import { JourneyTimeline } from "./components/JourneyTimeline";
import { ArchitectureDiagram } from "./components/ArchitectureDiagram";
import { TaglineBadge } from "./components/TaglineBadge";
import { TerminalShowcase } from "./components/TerminalShowcase";
import { ClaudeUIMockup } from "./components/ClaudeUIMockup";
import { getTerminalShowcaseData } from "./terminal-showcase-config";
import { highlightCode } from "@/lib/highlight";
import { claimStatusOf, evidenceOf } from "../../_lib/portfolio-content";

const PROJECT_DESCRIPTIONS: Record<string, string> = {
  // AIDEV-NOTE: VoiceLayer copy is pending Etan's decision.
  voicelayer:
    "Bi-directional voice I/O layer for AI assistants. VoiceBar MCP daemon with LaunchAgent auto-start. TTS via edge-tts, STT via whisper.cpp + Wispr Flow (~300ms). 2 tools (voice_speak, voice_ask) with auto-mode detection. 359 tests.",

};

export function generateStaticParams() {
  return [
    { slug: "brainlayer" },
    { slug: "voicelayer" },
    { slug: "cmuxlayer" },
    { slug: "whatsapp-mcp" },
    { slug: "golems" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);
  if (!project) return {};

  const description =
    PROJECT_DESCRIPTIONS[slug] ||
    project.shortDescription ||
    project.description;
  const title = `${project.title} | Etan Heyman`;
  const canonical = `/projects/${slug}`;

  const ogImages = project.logoUrl
    ? [
        {
          url: project.logoUrl,
          width: 512,
          height: 512,
          alt: `${project.title} logo`,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);

  if (!project) {
    notFound();
  }

  const showcase = getProjectShowcaseConfig(slug);
  const accent = showcase?.accent ?? getDefaultAccent();
  const archived = isArchived(showcase);
  const allProjects = await getAllProjects();
  const claim = claimStatusOf(project);
  const evidence = evidenceOf(project).filter((link) => link.kind !== "case-study");
  const terminalData = getTerminalShowcaseData(slug);

  // Pre-highlight install tab commands server-side
  const highlightedTabs = showcase?.installTabs
    ? await Promise.all(
        showcase.installTabs.map(async (tab) => {
          const lang =
            tab.label.toLowerCase().includes("mcp") ||
            tab.label.toLowerCase().includes("config") ||
            tab.label.toLowerCase().includes("json")
              ? "json"
              : "bash";
          const highlightedHtml = await highlightCode(tab.command, lang);
          return { ...tab, highlightedHtml };
        }),
      )
    : undefined;

  return (
    <main className="pf-container relative z-10 w-full max-w-[1100px] overflow-x-clip py-10 md:py-16">
      {/* ─── Hero ─── */}
      <section className="relative z-20 mb-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
          {project.logoUrl && (
            <div
              className="relative z-30 aspect-square h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-3xl md:h-[140px] md:w-[140px]"
              style={{
                boxShadow: `0 0 60px rgba(${accent.colorRgb}, 0.3)`,
              }}
            >
              {project.logoUrl.toLowerCase().endsWith(".svg") ||
              project.logoUrl.includes("#svg") ||
              project.logoUrl.includes("#logo") ? (
                <>
                  <div className="absolute inset-0 bg-blue-50" />
                  <img
                    src={project.logoUrl
                      .replace("#svg", "")
                      .replace("#logo", "")}
                    alt={`${project.title} logo`}
                    className="relative h-full w-full object-contain p-4"
                  />
                </>
              ) : (
                <Image
                  src={project.logoUrl}
                  alt={`${project.title} logo`}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          )}

          <div className="flex-1">
            <h1 className="pf-h1 mb-5">{project.title}</h1>
            <p className="pf-prose mb-4 text-[18px] md:text-[19px]">{project.description}</p>
            <p className={`pf-claim mt-0 mb-6 ${claim.checked ? "pf-claim-checked" : ""}`}>
              <span className="pf-claim-dot" aria-hidden="true" />
              {claim.checked
                ? `Description checked against the repository, ${claim.date}`
                : "Description not yet checked against the repository"}
            </p>

            {/* Badges + action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {showcase?.tagline && (
                <TaglineBadge
                  tagline={showcase.tagline}
                  accentColor={accent.color}
                  accentColorRgb={accent.colorRgb}
                />
              )}

              {evidence.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-btn pf-btn-ghost min-h-[40px] px-4 py-1.5 text-[15px]"
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="pf-btn pf-btn-ghost min-h-[40px] px-4 py-1.5 text-[15px]"
                  >
                    {link.label}
                  </Link>
                ),
              )}

              {archived && (
                <span className="flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--pf-line)] px-4 py-1.5 text-[15px] text-[var(--pf-sky)]">
                  <Archive aria-hidden="true" className="h-3.5 w-3.5" />
                  Archived
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Terminal Showcase ─── */}
      {terminalData && (
        <section className="relative z-20 mb-14">
          <p className="pf-small mb-3">Illustrative mockup of the CLI, not a live recording.</p>
          <TerminalShowcase
            tabs={terminalData.tabs}
            title={terminalData.title}
            accentColor={accent.color}
          />
        </section>
      )}

      {/* ─── Claude UI Mockup (BrainLayer only) ─── */}
      {slug === "brainlayer" && (
        <section className="relative z-20 mb-14">
          <h2 className="pf-h3 mb-6">
            See it in action
          </h2>
          <p className="pf-small mb-3">Illustrative mockup of an agent using BrainLayer, not a live recording.</p>
          <ClaudeUIMockup accentColor={accent.color} />
        </section>
      )}

      {/* AIDEV-NOTE: StatsBar is intentionally not rendered. Its showcase numbers
          (e.g. BrainLayer "12 MCP tools") contradict the claim-checked descriptions
          ("16 tools") and it counted up from 0, so reduced-motion visitors saw "0".
          Re-enable only with figures checked against the repos. */}
      {/* ─── Technologies ─── */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="relative z-20 mb-14">
          <h2 className="pf-h3 mb-6">
            Built with
          </h2>
          <div className="grid grid-cols-4 gap-5 sm:grid-cols-6 md:grid-cols-8 xl:gap-11">
            {project.technologies.map((tech) => (
              <TechIconWrapper
                key={tech}
                name={tech as TechIconName}
                showLabel
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── Features Grid ─── */}
      {showcase?.features && (
        <section className="relative z-20 mb-14">
          <h2 className="pf-h3 mb-6">
            Key features
          </h2>
          <FeaturesGrid
            features={showcase.features}
            accentColor={accent.color}
            accentColorRgb={accent.colorRgb}
          />
        </section>
      )}

      {/* ─── How It Works ─── */}
      {showcase?.architectureFlow && (
        <section className="relative z-20 mb-14">
          <h2 className="pf-h3 mb-6">
            How it works
          </h2>
          <ArchitectureDiagram
            nodes={showcase.architectureFlow}
            accentColor={accent.color}
            accentColorRgb={accent.colorRgb}
          />
        </section>
      )}

      {/* ─── Getting Started ─── */}
      {showcase?.installTabs && (
        <section className="relative z-20 mb-14">
          <h2 className="pf-h3 mb-6">
            Get started
          </h2>
          <CodeBlock
            tabs={highlightedTabs ?? showcase.installTabs}
            accentColor={accent.color}
          />
        </section>
      )}

      {/* ─── Project Journey ─── */}
      {project.projectJourney && project.projectJourney.length > 0 && (
        <section className="relative z-20 mb-14">
          <h2 className="pf-h3 mb-8">
            The journey
          </h2>
          <JourneyTimeline
            steps={project.projectJourney}
            accentColor={accent.color}
            accentColorRgb={accent.colorRgb}
          />
        </section>
      )}

      {/* ─── Cross Links ─── */}
      <section className="relative z-20">
        <CrossLinks projects={allProjects} currentSlug={slug} />
      </section>
    </main>
  );
}
