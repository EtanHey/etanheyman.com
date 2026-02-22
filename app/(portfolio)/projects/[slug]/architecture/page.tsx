import { notFound } from "next/navigation";
import { getProjectBySlugOrId } from "@/lib/projects";
import { highlightCode } from "@/lib/highlight";
import {
  getProjectShowcaseConfig,
  getDefaultAccent,
} from "../project-showcase-config";
import { getArchitectureData } from "../architecture-config";
import { ArchitectureDiagram } from "../components/ArchitectureDiagram";
import { ArchCodeBlock } from "../components/ArchCodeBlock";
import { InsightCallout } from "../components/InsightCallout";
import { ComparisonTable } from "../components/ComparisonTable";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    { slug: "brainlayer" },
    { slug: "voicelayer" },
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

  const title = `${project.title} — Architecture | Etan Heyman`;
  const description = `Technical architecture deep-dive for ${project.title}. Data pipelines, search systems, and infrastructure decisions.`;
  const canonical = `/projects/${slug}/architecture`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ArchitecturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);
  if (!project) notFound();

  const sections = getArchitectureData(slug);
  if (!sections) notFound();

  // Pre-highlight all code blocks server-side
  const highlightedSections = await Promise.all(
    sections.map(async (section) => ({
      ...section,
      codeHighlightedHtml: section.codeExample
        ? await highlightCode(section.codeExample.code, section.codeExample.language)
        : undefined,
    })),
  );

  const showcase = getProjectShowcaseConfig(slug);
  const accent = showcase?.accent ?? getDefaultAccent();

  return (
    <main className="relative z-10 mx-auto w-full max-w-5xl overflow-x-hidden px-4 py-8 md:px-8 md:py-16">
      {/* Page header */}
      <section className="mb-16">
        <h1 className="mb-3 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
          Architecture
        </h1>
        <p className="max-w-[600px] break-words font-[Nutmeg] text-[22px] font-bold leading-tight text-white md:text-[36px]">
          How {project.title} works
        </p>
      </section>

      {/* Sections */}
      <div className="space-y-14 md:space-y-20">
        {highlightedSections.map((section, i) => (
          <section key={section.title} className="relative">
            {/* Section number */}
            <div
              className="mb-6 font-mono text-[10px] tracking-[0.2em] uppercase md:text-[11px]"
              style={{ color: `rgba(${accent.colorRgb}, 0.4)` }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>

            {/* Title */}
            <h2 className="mb-5 font-[Nutmeg] text-[20px] font-bold text-white md:text-[28px]">
              {section.title}
            </h2>

            {/* Description */}
            <p className="mb-8 max-w-[680px] font-[Nutmeg] text-[14px] font-light leading-relaxed text-white/50 md:text-[16px]">
              {section.description}
            </p>

            {/* Visual elements */}
            <div className="space-y-6">
              {section.diagramNodes && (
                <ArchitectureDiagram
                  nodes={section.diagramNodes}
                  accentColor={accent.color}
                  accentColorRgb={accent.colorRgb}
                />
              )}

              {section.codeExample && (
                <ArchCodeBlock
                  code={section.codeExample.code}
                  language={section.codeExample.language}
                  caption={section.codeExample.caption}
                  accentColor={accent.color}
                  accentColorRgb={accent.colorRgb}
                  highlightedHtml={section.codeHighlightedHtml}
                />
              )}

              {section.callout && (
                <InsightCallout
                  title={section.callout.title}
                  text={section.callout.text}
                  accentColor={accent.color}
                  accentColorRgb={accent.colorRgb}
                />
              )}

              {section.comparisonTable && (
                <ComparisonTable
                  headers={section.comparisonTable.headers}
                  rows={section.comparisonTable.rows}
                  accentColor={accent.color}
                  accentColorRgb={accent.colorRgb}
                />
              )}
            </div>

            {/* Section divider */}
            {i < sections.length - 1 && (
              <div className="mt-14 md:mt-20">
                <div
                  className="h-px w-16"
                  style={{
                    backgroundColor: `rgba(${accent.colorRgb}, 0.15)`,
                  }}
                />
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
