import { getAllProjects } from "@/lib/projects";
import Link from "next/link";
import { TechIconWrapper, TechIconName } from "@/app/components/tech-icons/TechIconWrapper";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className="relative z-10 container mx-auto px-4 py-8 md:px-8 lg:px-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 font-[Nutmeg] text-[34px] font-semibold text-blue-200 md:text-[64px]">
          All Projects
        </h1>
        <p className="font-[Nutmeg] text-[15px] leading-[1.2] font-light text-white/80 md:text-[20px]">
          Explore my complete portfolio of web development, machine learning, and software engineering projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block"
          >
            <div className="relative h-[400px] overflow-hidden rounded-[40px] border border-white bg-gray-900 shadow-lg transition-all duration-300 hover:scale-[1.02] md:hover:scale-100 md:hover:shadow-[0px_0px_32px_0px_rgba(136,207,248,1)]">
              {/* Background Image */}
              {project.previewImage ? (
                <img
                  src={project.previewImage}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700" />
              )}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#00003F] from-[10%] via-[#00003F]/0 via-[55%] to-transparent" />

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                {/* Framework Tag - Top Right */}
                {project.framework && (
                  <div className="flex justify-end">
                    <span className="inline-block rounded-[40px] bg-[#00003F] px-3 py-2 text-[14px] font-normal text-white sm:px-4 sm:py-2.5 md:px-4 md:py-3 md:text-[16px]">
                      {project.framework}
                    </span>
                  </div>
                )}

                {/* Project Info - Bottom */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-[Nutmeg] text-[20px] font-semibold text-white sm:text-[24px] md:text-[26px]">
                    {project.title}
                  </h3>
                  <p className="font-[Nutmeg] line-clamp-3 text-[14px] leading-[1.2] text-white font-light sm:text-[15px] md:text-[16px]">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <div key={tech} className="w-8 h-8">
                          <TechIconWrapper name={tech as TechIconName} />
                        </div>
                      ))}
                      {project.technologies.length > 4 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00003F] text-white text-xs">
                          +{project.technologies.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
