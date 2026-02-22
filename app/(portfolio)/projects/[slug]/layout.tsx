import {
  getProjectShowcaseConfig,
  getDefaultAccent,
  isMiniSiteProject,
} from "./project-showcase-config";
import { MiniSiteNav } from "./components/MiniSiteNav";

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

  return (
    <>
      <MiniSiteNav
        slug={slug}
        accentColor={accent.color}
        accentColorRgb={accent.colorRgb}
      />
      {children}
    </>
  );
}
