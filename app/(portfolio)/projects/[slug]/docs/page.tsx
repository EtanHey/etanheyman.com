import { notFound } from "next/navigation";
import { getProjectBySlugOrId } from "@/lib/projects";
import { highlightCode } from "@/lib/highlight";
import {
  getProjectShowcaseConfig,
  getDefaultAccent,
} from "../project-showcase-config";
import { getGettingStartedData } from "../getting-started-config";
import { StepCard } from "../components/StepCard";
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

  const title = `${project.title} — Get Started | Etan Heyman`;
  const description = `Quick-start guide for ${project.title}. Installation, configuration, and first steps.`;
  const canonical = `/projects/${slug}/docs`;

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

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);
  if (!project) notFound();

  const steps = getGettingStartedData(slug);
  if (!steps) notFound();

  // Pre-highlight all code blocks server-side
  const highlightedSteps = await Promise.all(
    steps.map(async (step) => ({
      ...step,
      commandHighlightedHtml: step.command
        ? await highlightCode(step.command, step.language ?? "bash")
        : undefined,
    })),
  );

  const showcase = getProjectShowcaseConfig(slug);
  const accent = showcase?.accent ?? getDefaultAccent();

  return (
    <main className="relative z-10 mx-auto max-w-5xl overflow-x-hidden px-4 py-8 md:px-8 md:py-16">
      {/* Page header */}
      <section className="mb-16">
        <h1 className="mb-3 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
          Get started
        </h1>
        <p className="max-w-[600px] break-words font-[Nutmeg] text-[22px] font-bold leading-tight text-white md:text-[36px]">
          Set up {project.title}
        </p>
      </section>

      {/* Steps */}
      <div className="max-w-2xl">
        {highlightedSteps.map((step, i) => (
          <StepCard
            key={step.step}
            step={step}
            accentColor={accent.color}
            accentColorRgb={accent.colorRgb}
            isLast={i === steps.length - 1}
            commandHighlightedHtml={step.commandHighlightedHtml}
          />
        ))}
      </div>
    </main>
  );
}
