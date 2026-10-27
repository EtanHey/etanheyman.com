import type { Project } from "@/lib/projects";
import { deriveProjectCard, type CardShowcase } from "@/lib/project-card";
import { getProjectShowcaseConfig } from "@/app/(portfolio)/projects/[slug]/project-showcase-config";
import { ProjectCardView, type CardVariant } from "./ProjectCardView";

// AIDEV-NOTE: Server component on purpose. The showcase config imports the
// ~790 KB skills manifest; resolving it here keeps it out of the client
// bundle. Only the derived card model crosses into ProjectCardView.

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  /** Position in the grid; odd columns enter a beat later. */
  revealIndex?: number;
  className?: string;
}

function getCardShowcase(project: Project): CardShowcase | null {
  const config = project.slug ? getProjectShowcaseConfig(project.slug) : null;
  if (!config) return null;
  return { accentRgb: config.accent.colorRgb, stats: config.stats };
}

function renderCard(
  { project, priority = false, revealIndex, className }: ProjectCardProps,
  variant: CardVariant,
) {
  return (
    <ProjectCardView
      card={deriveProjectCard(project, getCardShowcase(project))}
      variant={variant}
      priority={priority}
      revealIndex={revealIndex}
      className={className}
    />
  );
}

export function ProjectCard(props: ProjectCardProps) {
  return renderCard(props, "default");
}

export function FeaturedProjectCard(props: ProjectCardProps) {
  return renderCard({ priority: true, ...props }, "featured");
}

export function MinimalProjectCard(props: ProjectCardProps) {
  return renderCard({ priority: true, ...props }, "minimal");
}

export function HomeProjectCard(props: ProjectCardProps) {
  return <MinimalProjectCard {...props} />;
}
