import {
  getProjectShowcaseConfig,
  getDefaultAccent,
  isMiniSiteProject,
} from "./project-showcase-config";
import { getProjectBySlugOrId } from "@/lib/projects";
import { MiniSiteNav } from "./components/MiniSiteNav";

function buildJsonLd(
  project: {
    title: string;
    description: string;
    shortDescription: string;
    logoUrl: string | null;
    gitUrl: string;
    liveUrl: string | null;
  },
  slug: string
) {
  const description = project.shortDescription || project.description;
  const url = project.liveUrl || `https://etanheyman.com/projects/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description,
    url,
    author: {
      "@type": "Person",
      name: "Etan Heyman",
    },
    codeRepository: project.gitUrl !== "private" ? project.gitUrl : undefined,
    image: project.logoUrl || undefined,
  };
}

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

  const jsonLd = project ? buildJsonLd(project, slug) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/\u003c\/script/gi, "<\\/script"),
          }}
        />
      )}
      <MiniSiteNav
        slug={slug}
        accentColor={accent.color}
        accentColorRgb={accent.colorRgb}
        title={project?.title ?? slug}
        logoUrl={project?.logoUrl ?? null}
      />
      {children}
    </>
  );
}
