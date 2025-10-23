import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function ProjectCard({
  project,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = ""
}: ProjectCardProps) {
  // Check if the preview image is an SVG or logo
  const isSvgOrLogo = project.previewImage && (
    (project.previewImage.toLowerCase().endsWith('.svg') && !project.previewImage.includes('hand-detection')) ||
    project.previewImage.includes('#svg') ||
    project.previewImage.includes('#logo')
  );

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block"
    >
      <div className={`relative overflow-hidden rounded-[40px] border border-white bg-gray-900 shadow-lg transition-all duration-300 hover:scale-[1.02] md:hover:scale-100 md:hover:shadow-[0px_0px_32px_0px_rgba(136,207,248,1)] ${className}`}>
        {/* Background Image */}
        {project.previewImage ? (
          <>
            {/* Add light blue background for SVG/logo files (except hand-detection which has its own bg) */}
            {isSvgOrLogo && (
              <div className="absolute inset-0 bg-blue-50" />
            )}
            {isSvgOrLogo ? (
              <img
                src={project.previewImage.replace('#svg', '').replace('#logo', '')}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-contain object-center p-12"
                loading={priority ? "eager" : "lazy"}
              />
            ) : (
              <Image
                src={project.previewImage}
                alt={project.title}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover object-center"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700" />
        )}

        {/* Dark Gradient Overlay - Always at the bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00003F] from-[10%] via-[#00003F]/0 via-[55%] to-transparent" />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col p-6 md:p-8">
          {/* Framework Tag - Top Right */}
          {project.framework && (
            <div className="flex justify-end mb-auto">
              <span className="inline-block rounded-[40px] bg-[#00003F] px-3 py-2 text-[14px] font-normal text-white sm:px-4 sm:py-2.5 md:px-4 md:py-3 md:text-[16px]">
                {project.framework}
              </span>
            </div>
          )}

          {/* Spacer to push content to bottom */}
          <div className="flex-grow" />

          {/* Project Info - Bottom */}
          <div>
            <h3 className="font-[Nutmeg] text-[20px] font-semibold text-white sm:text-[24px] md:text-[26px]">
              {project.title}
            </h3>
            <p className="font-[Nutmeg] line-clamp-3 text-[14px] leading-[1.2] text-white font-light sm:text-[15px] md:text-[16px] mt-2">
              {project.shortDescription || project.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface FeaturedProjectCardProps extends Omit<ProjectCardProps, 'className'> {
  project: Project;
}

export function FeaturedProjectCard({
  project,
  priority = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
}: FeaturedProjectCardProps) {
  // Check if the preview image is an SVG or logo
  const isSvgOrLogo = project.previewImage && (
    (project.previewImage.toLowerCase().endsWith('.svg') && !project.previewImage.includes('hand-detection')) ||
    project.previewImage.includes('#svg') ||
    project.previewImage.includes('#logo')
  );

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block"
    >
      <div className="relative h-[300px] sm:h-[350px] md:h-[380px] lg:h-[394px] overflow-hidden rounded-[40px] border border-white bg-gray-900 shadow-lg transition-all duration-300 hover:scale-[1.02] md:hover:scale-100 md:hover:shadow-[0px_0px_32px_0px_rgba(136,207,248,1)]">
        {/* Background Image */}
        {project.previewImage ? (
          <>
            {/* Add light blue background for SVG/logo files (except hand-detection which has its own bg) */}
            {isSvgOrLogo && (
              <div className="absolute inset-0 bg-blue-50" />
            )}
            {isSvgOrLogo ? (
              <img
                src={project.previewImage.replace('#svg', '').replace('#logo', '')}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-contain object-center p-12"
              />
            ) : (
              <Image
                src={project.previewImage}
                alt={project.title}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover object-center"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-orange-300" />
        )}

        {/* Dark Gradient Overlay - Always at the bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00003F] from-[10%] via-[#00003F]/0 via-[55%] to-transparent" />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col p-6 md:px-12 md:py-10">
          {/* Framework Tag - Top Right */}
          {project.framework && (
            <div className="flex justify-end mb-auto">
              <span className="inline-block rounded-[40px] bg-[#00003F] px-3 py-2 text-[14px] font-normal text-white sm:px-4 sm:py-2.5 md:px-4 md:py-3 md:text-[16px]">
                {project.framework}
              </span>
            </div>
          )}

          {/* Spacer to push content to bottom */}
          <div className="flex-grow" />

          {/* Project Info - Bottom */}
          <div>
            <h3 className="font-[Nutmeg] text-[22px] font-semibold text-white sm:text-[26px] md:text-[28px] lg:text-[32px]">
              {project.title}
            </h3>
            <p className="font-[Nutmeg] line-clamp-2 text-[15px] leading-[1.2] text-white font-light sm:text-[16px] md:max-w-[622px] md:text-[17px] lg:text-[18px] mt-2">
              {project.shortDescription || project.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface HomeProjectCardProps extends Omit<ProjectCardProps, 'className'> {
  project: Project;
}

export function HomeProjectCard({
  project,
  priority = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
}: HomeProjectCardProps) {
  // Check if the preview image is an SVG or logo
  const isSvgOrLogo = project.previewImage && (
    (project.previewImage.toLowerCase().endsWith('.svg') && !project.previewImage.includes('hand-detection')) ||
    project.previewImage.includes('#svg') ||
    project.previewImage.includes('#logo')
  );

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block"
    >
      <div className="relative h-[300px] sm:h-[350px] md:aspect-square md:h-auto overflow-hidden rounded-[40px] border border-white bg-gray-900 shadow-lg transition-all duration-300 hover:scale-[1.02] md:hover:scale-100 md:hover:shadow-[0px_0px_32px_0px_rgba(136,207,248,1)]">
        {/* Background Image */}
        {project.previewImage ? (
          <>
            {/* Add light blue background for SVG/logo files (except hand-detection which has its own bg) */}
            {isSvgOrLogo && (
              <div className="absolute inset-0 bg-blue-50" />
            )}
            {isSvgOrLogo ? (
              <img
                src={project.previewImage.replace('#svg', '').replace('#logo', '')}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-contain object-center p-12"
              />
            ) : (
              <Image
                src={project.previewImage}
                alt={project.title}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover object-center"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-orange-300" />
        )}

        {/* Dark Gradient Overlay - Always at the bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00003F] from-[10%] via-[#00003F]/0 via-[55%] to-transparent" />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col p-6 sm:p-8 md:p-8 lg:p-10 xl:px-12 xl:py-10">
          {/* Framework Tag - Top Right */}
          {project.framework && (
            <div className="flex justify-end mb-auto">
              <span className="inline-block rounded-[40px] bg-[#00003F] px-3 py-2 text-[14px] font-normal text-white sm:px-4 sm:py-2.5 md:px-4 md:py-3 md:text-[16px]">
                {project.framework}
              </span>
            </div>
          )}

          {/* Spacer to push content to bottom */}
          <div className="flex-grow" />

          {/* Project Info - Bottom */}
          <div>
            <h3 className="font-[Nutmeg] text-[22px] font-semibold text-white sm:text-[26px] md:text-[24px] lg:text-[28px] xl:text-[32px]">
              {project.title}
            </h3>
            <p className="font-[Nutmeg] line-clamp-2 text-[15px] leading-[1.2] text-white font-light sm:text-[16px] md:text-[16px] lg:text-[17px] xl:text-[18px] mt-2">
              {project.shortDescription || project.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}