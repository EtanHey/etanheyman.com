import AdminEditButton from "@/app/components/AdminEditButton";
import { getProjectBySlugOrId, getAllProjects } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Github,
  BookOpen,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import {
  TechIconWrapper,
  TechIconName,
} from "@/app/components/tech-icons/TechIconWrapper";
import {
  getProjectShowcaseConfig,
  getDefaultAccent,
} from "./project-showcase-config";
import { StatsBar } from "./components/StatsBar";
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
  const allProjects = await getAllProjects();

  const isGitPrivate = project.gitUrl === "private";
  const terminalData = getTerminalShowcaseData(slug);

  // Pre-highlight install tab commands server-side
  const highlightedTabs = showcase?.installTabs
    ? await Promise.all(
        showcase.installTabs.map(async (tab) => {
          const lang = tab.label.toLowerCase().includes("mcp") ||
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
    <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-16">
      {/* Ambient accent glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 opacity-[0.06]"
        style={{
          background: `radial-gradient(ellipse, ${accent.color}, transparent 70%)`,
        }}
      />

      {/* Back + Admin */}
      <div className="relative z-20 mb-12 flex items-center justify-between">
        <Link
          href="/projects"
          className="flex items-center gap-2 font-[Nutmeg] text-[14px] font-light text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
          All Projects
        </Link>
        <AdminEditButton projectId={project.id} />
      </div>

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
            <h1 className="mb-3 font-[Nutmeg] text-[30px] font-bold leading-[1.1] text-white md:text-[52px]">
              {project.title}
            </h1>
            <p className="mb-5 max-w-[620px] font-[Nutmeg] text-[15px] font-light leading-relaxed text-white/55 md:text-[17px]">
              {project.description}
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

              {!isGitPrivate && project.gitUrl && (
                <a
                  href={project.gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 font-[Nutmeg] text-[12px] font-light text-white/50 transition-colors hover:border-white/20 hover:text-white/75 md:text-[13px]"
                >
                  <Github className="h-3.5 w-3.5" />
                  Source
                </a>
              )}

              {project.docsUrl &&
                (project.docsUrl.startsWith("/") ? (
                  <Link
                    href={project.docsUrl}
                    className="flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 font-[Nutmeg] text-[12px] font-light text-white/50 transition-colors hover:border-white/20 hover:text-white/75 md:text-[13px]"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Docs
                  </Link>
                ) : (
                  <a
                    href={project.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 font-[Nutmeg] text-[12px] font-light text-white/50 transition-colors hover:border-white/20 hover:text-white/75 md:text-[13px]"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Docs
                  </a>
                ))}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full px-4 py-2 font-[Nutmeg] text-[12px] font-light text-white transition-colors md:text-[13px]"
                  style={{ backgroundColor: accent.color }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Terminal Showcase ─── */}
      {terminalData && (
        <section className="relative z-20 mb-14">
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
          <h2 className="mb-6 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
            See it in action
          </h2>
          <ClaudeUIMockup accentColor={accent.color} />
        </section>
      )}

      {/* ─── Stats Bar ─── */}
      {showcase?.stats && (
        <section className="relative z-20 mb-14">
          <StatsBar stats={showcase.stats} accentColor={accent.color} />
        </section>
      )}

      {/* ─── Technologies ─── */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="relative z-20 mb-14">
          <h2 className="mb-6 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
            Built with
          </h2>
          <div className="grid grid-cols-6 gap-[23.45px] md:grid-cols-8 xl:gap-11">
            {project.technologies.map((tech) => (
              <TechIconWrapper key={tech} name={tech as TechIconName} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Features Grid ─── */}
      {showcase?.features && (
        <section className="relative z-20 mb-14">
          <h2 className="mb-6 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
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
          <h2 className="mb-6 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
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
          <h2 className="mb-6 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
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
          <h2 className="mb-8 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
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
