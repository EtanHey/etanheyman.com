import Link from "next/link";
import type { Project } from "@/lib/projects";
import { getProjectShowcaseConfig, getDefaultAccent } from "../project-showcase-config";

const ECOSYSTEM_SLUGS = new Set(["golems", "brainlayer", "voicelayer"]);

export function CrossLinks({
  projects,
  currentSlug,
}: {
  projects: Project[];
  currentSlug: string;
}) {
  const isEcosystemProject = ECOSYSTEM_SLUGS.has(currentSlug);
  const related = projects.filter(
    (p) =>
      p.slug !== currentSlug &&
      p.featured &&
      (!isEcosystemProject || ECOSYSTEM_SLUGS.has(p.slug ?? "")),
  );
  if (related.length === 0) return null;

  return (
    <div>
      <h2 className="mb-6 font-mono text-[11px] tracking-[0.2em] text-white/30 uppercase md:text-[12px]">
        {isEcosystemProject ? "Part of the ecosystem" : "More projects"}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {related.map((project) => {
          const config = getProjectShowcaseConfig(project.slug ?? "");
          const accent = config?.accent ?? getDefaultAccent();
          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12]"
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(ellipse at bottom right, rgba(${accent.colorRgb}, 0.06), transparent 60%)`,
                }}
              />
              <div className="relative">
                <div
                  className="mb-3 h-1 w-8 rounded-full"
                  style={{
                    backgroundColor: `rgba(${accent.colorRgb}, 0.5)`,
                  }}
                />
                <h3 className="mb-2 font-[Nutmeg] text-[17px] font-semibold text-white">
                  {project.title}
                </h3>
                <p className="font-[Nutmeg] text-[13px] font-light leading-relaxed text-white/45">
                  {project.shortDescription}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
