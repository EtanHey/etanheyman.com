import { notFound } from "next/navigation";
import { getProjectBySlugOrId } from "@/lib/projects";
import { highlightCode } from "@/lib/highlight";
import {
  getProjectShowcaseConfig,
  getDefaultAccent,
} from "../project-showcase-config";
import { getFeaturesData } from "../features-config";
import { FeatureSectionRow } from "../components/FeatureSectionRow";
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

  return {
    title: `${project.title} — Features | Etan Heyman`,
    description: `Detailed feature showcase for ${project.title}. Capabilities, code examples, and technical highlights.`,
  };
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);
  if (!project) notFound();

  const sections = getFeaturesData(slug);
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
    <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-16">
      {/* Page header */}
      <section className="mb-16">
        <h1 className="mb-3 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
          Features
        </h1>
        <p className="max-w-[600px] font-[Nutmeg] text-[22px] font-bold leading-tight text-white md:text-[36px]">
          What {project.title} can do
        </p>
      </section>

      {/* Feature sections */}
      <div className="space-y-24 md:space-y-32">
        {highlightedSections.map((section, i) => (
          <FeatureSectionRow
            key={section.title}
            section={section}
            index={i}
            accentColor={accent.color}
            accentColorRgb={accent.colorRgb}
            codeHighlightedHtml={section.codeHighlightedHtml}
          />
        ))}
      </div>
    </main>
  );
}
