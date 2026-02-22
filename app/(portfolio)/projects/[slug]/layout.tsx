import {
  getProjectShowcaseConfig,
  getDefaultAccent,
  isMiniSiteProject,
} from "./project-showcase-config";
import { getProjectBySlugOrId } from "@/lib/projects";
import { MiniSiteNav } from "./components/MiniSiteNav";
import { SubpageHeader } from "./components/SubpageHeader";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isMiniSiteProject(slug)) {
    return <>{children}</>;
  }

  const config = getProjectShowcaseConfig(slug);
  const accent = config?.accent ?? getDefaultAccent();
  const project = await getProjectBySlugOrId(slug);

  return (
    <>
      <MiniSiteNav
        slug={slug}
        accentColor={accent.color}
        accentColorRgb={accent.colorRgb}
      />
      {/* Persistent project identity for sub-pages (overview has its own hero) */}
      {project && (
        <SubpageHeader slug={slug} title={project.title} logoUrl={project.logoUrl} />
      )}
      {children}
    </>
  );
}
