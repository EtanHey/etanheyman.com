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
  const notice = config?.maintenanceNotice;
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
      {notice && (
        <aside className="mx-auto mt-4 w-full max-w-5xl px-4 md:px-8" aria-label="Maintenance notice">
          <p className="rounded-lg border border-white/[0.06] bg-[#080845] px-3 py-2 text-[12px] leading-5 text-white/70 md:text-sm">
            {notice.beforeLink}
            <a
              href={notice.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm underline underline-offset-2 hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: accent.color }}
            >
              {notice.link.text}
            </a>
            {notice.afterLink}
          </p>
        </aside>
      )}
      {children}
    </>
  );
}
