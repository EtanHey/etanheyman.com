import AdminEditButton from "@/app/components/AdminEditButton";
import { getProjectBySlugOrId } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Github, BookOpen } from "lucide-react";
import {
  TechIconWrapper,
  TechIconName,
} from "@/app/components/tech-icons/TechIconWrapper";

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

  const isGitPrivate = project.gitUrl === "private";
  const GitEl = isGitPrivate ? "button" : "a";

  return (
    <main className="relative z-10 container mx-auto px-4 py-8 md:px-8 lg:px-16">
      {/* Back button and admin button */}
      <div className="relative z-20 mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-block text-blue-300 transition-colors hover:text-blue-200"
        >
          ← Back to Home
        </Link>

        <AdminEditButton projectId={project.id} />
      </div>

      {/* Hero Section */}
      <div className="relative z-20 mb-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
            {project.logoUrl && (
              <div className="relative z-30 aspect-square h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-[40px] shadow-[0px_0px_80px_0px_rgba(15,130,235,1)] md:h-[180px] md:w-[180px]">
                {/* Check if logo is SVG or has #svg/#logo marker */}
                {(project.logoUrl.toLowerCase().endsWith('.svg') ||
                  project.logoUrl.includes('#svg') ||
                  project.logoUrl.includes('#logo')) ? (
                  <>
                    {/* Add light background for SVG/logo files */}
                    <div className="absolute inset-0 bg-blue-50" />
                    <img
                      src={project.logoUrl.replace('#svg', '').replace('#logo', '')}
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
            <div>
              <h1 className="mb-4 font-[Nutmeg] text-[34px] font-semibold text-white md:text-[64px]">
                {project.title}
              </h1>
              <p className="font-[Nutmeg] text-[15px] leading-[1.2] font-light text-white/80 md:text-[20px]">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-20 mb-12 flex flex-col gap-4 md:flex-row">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-4 rounded-[80px] bg-blue-500 px-8 py-5 font-[Nutmeg] text-[20px] text-white transition-colors hover:bg-blue-600 md:text-[24px]"
          >
            Go to website
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 8H15M15 8L8 1M15 8L8 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
        <GitEl
          {...(isGitPrivate
            ? {
                type: "button" as const,
                disabled: true,
                "aria-label":
                  "Code repository for this project is private",
              }
            : {
                href: project.gitUrl,
                target: "_blank",
                rel: "noopener noreferrer",
              })}
          className={
            isGitPrivate
              ? "flex items-center justify-center gap-3 rounded-[80px] border border-white/20 bg-white/5 px-8 py-5 font-[Nutmeg] text-[18px] text-white/70 cursor-not-allowed md:text-[20px]"
              : "flex items-center justify-center gap-4 rounded-[80px] border-2 border-[#59BCF5] px-8 py-5 font-[Nutmeg] text-[20px] text-[#59BCF5] transition-colors hover:bg-[#59BCF5] hover:text-white md:text-[24px]"
          }
        >
          {isGitPrivate ? (
            "Code is private"
          ) : (
            <>
              Github link
              <Github aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </GitEl>
        {project.docsUrl && (
          project.docsUrl.startsWith('/') ? (
            <Link
              href={project.docsUrl}
              className="flex items-center justify-center gap-4 rounded-[80px] border-2 border-emerald-400 px-8 py-5 font-[Nutmeg] text-[20px] text-emerald-400 transition-colors hover:bg-emerald-400 hover:text-white md:text-[24px]"
            >
              Docs
              <BookOpen aria-hidden="true" className="h-5 w-5" />
            </Link>
          ) : (
            <a
              href={project.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 rounded-[80px] border-2 border-emerald-400 px-8 py-5 font-[Nutmeg] text-[20px] text-emerald-400 transition-colors hover:bg-emerald-400 hover:text-white md:text-[24px]"
            >
              Docs
              <BookOpen aria-hidden="true" className="h-5 w-5" />
            </a>
          )
        )}
      </div>

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="relative z-20 mb-16">
          <div className="grid grid-cols-6 gap-[23.45px] md:grid-cols-8 xl:gap-11">
            {project.technologies.map((tech) => (
              <TechIconWrapper key={tech} name={tech as TechIconName} />
            ))}
          </div>
        </div>
      )}

      {/* Project Journey */}
      {project.projectJourney && project.projectJourney.length > 0 && (
        <div className="relative z-20">
          <h2 className="mb-8 font-[Nutmeg] text-[26px] font-semibold text-[#88CFF8] md:mb-12 md:text-[48px]">
            Project journey
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-0 w-1 rounded-lg bg-[#002072]">
              <div
                className="absolute top-0 left-0 w-full rounded-lg bg-blue-500"
                style={{
                  height: `${(1 / project.projectJourney.length) * 100}%`,
                }}
              />
            </div>

            {/* Journey items */}
            <div className="space-y-16 md:space-y-24">
              {project.projectJourney.map((journey, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-6 md:flex-row md:gap-12"
                >
                  {/* Content */}
                  <div className="flex-1 pl-8 md:pl-12">
                    <div className="mb-3 flex items-start gap-4">
                      <div className="relative z-30 flex size-[29px] items-center justify-center rounded-full bg-blue-500 shadow-[0px_0px_24px_0px_rgba(15,130,235,1)]">
                        <span className="font-[Nutmeg] text-[20px] leading-none font-light text-white">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="font-[Nutmeg] text-[20px] font-semibold text-white md:text-[24px]">
                        {journey.title}
                      </h3>
                    </div>
                    <p className="max-w-[558px] font-[Nutmeg] text-[14px] leading-[1.2] font-light text-white/80 md:text-[18px]">
                      {journey.description}
                    </p>
                  </div>

                  {/* Image */}
                  {journey.imgUrl && (
                    <div className="relative z-30 h-[186px] w-full overflow-hidden rounded-[10px] shadow-[0px_0px_40px_0px_rgba(89,188,245,1)] md:h-[375px] md:w-[597px] md:rounded-[20px]">
                      <Image
                        src={journey.imgUrl}
                        alt={journey.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
