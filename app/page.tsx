import { prisma as db } from "@/lib/db";
import Link from "next/link";
import Me from "./components/Me";

export default async function Home() {
  // Fetch all projects
  const projects = await db.project.findMany({
    take: 5,
  });

  // Find featured project or use first one
  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const otherProjects = projects.filter((p) => p.id !== featuredProject?.id);

  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <section className="flex flex-col px-[18px] pt-[80px] pb-10 sm:px-8 sm:pt-[60px] md:px-12 md:pt-[50px] lg:px-20 lg:pt-20 xl:px-40 2xl:px-[323px] md:pb-16">
        <div className="mx-auto w-full max-w-[354px] sm:max-w-[500px] md:flex md:max-w-none md:items-center md:justify-between md:gap-8">
          {/* Content Container */}
          <div className="flex flex-col gap-4 md:flex-1 md:max-w-[645px] md:gap-8">
            {/* Profile Image - Mobile Only */}
            <div className="mb-6 sm:mb-8 w-[100px] h-[100px] md:hidden">
              <Me />
            </div>

            {/* Name - Mobile & Desktop */}
            <h1 className="font-[Nutmeg] text-[34px] leading-none font-semibold text-blue-200 sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px]">
              Etan Heyman<span className="text-blue-200">.</span>
            </h1>

            {/* Tagline */}
            <p className="font-[Nutmeg] text-[26px] leading-none font-light text-white sm:text-[30px] md:text-[32px] lg:text-[36px] xl:text-[40px]">
              I'll develop anything, anywhere.
            </p>

            {/* CTA Buttons */}
            <div className="flex w-full flex-col gap-4 mt-8 md:mt-0 sm:flex-row md:gap-4 lg:gap-8">
              <Link href="#projects" className="w-full sm:w-auto">
                <button className="bg-primary flex w-full sm:w-auto items-center justify-center gap-2 rounded-[80px] py-4 px-6 text-[20px] font-normal text-white transition-all hover:bg-blue-600 active:scale-[0.98] sm:px-8 md:px-12 lg:px-16 md:h-[68px] md:gap-4 md:text-[20px] lg:text-[24px] whitespace-nowrap">
                  My projects
                  <svg
                    className="h-[6px] w-[11px] md:h-2 md:w-[15px]"
                    fill="none"
                    viewBox="0 0 15 8"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M1 1l6.5 6L14 1"
                    />
                  </svg>
                </button>
              </Link>
              <Link
                href="/Etan_Heyman_resume.pdf"
                target="_blank"
                className="w-full sm:w-auto"
              >
                <button className="hover:border-primary flex w-full sm:w-auto items-center justify-center rounded-[80px] border-2 border-blue-300 bg-transparent py-4 px-6 text-[20px] font-normal text-blue-300 transition-all hover:bg-blue-300/10 active:scale-[0.98] whitespace-nowrap sm:px-8 md:px-12 lg:px-16 md:h-[68px] md:text-[20px] lg:text-[24px]">
                  Download my CV
                </button>
              </Link>
            </div>
          </div>

          {/* Profile Image - Desktop Only */}
          <div className="hidden md:block md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] xl:w-[468px] xl:h-[468px] flex-shrink-0">
            <Me />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="px-[18px] py-10 sm:px-8 md:px-12 lg:px-20 xl:px-40 2xl:px-[323px] md:py-16 lg:py-20 xl:py-[100px] scroll-mt-[80px] sm:scroll-mt-[60px] md:scroll-mt-[40px] lg:scroll-mt-[20px]">
        <div className="mx-auto max-w-[354px] sm:max-w-[500px] md:max-w-none space-y-8 sm:space-y-10 md:space-y-12">
          {/* Featured Project - Full Width */}
          {featuredProject && (
            <Link
              key={featuredProject.id}
              href={`/projects/${featuredProject.id}`}
              className="block"
            >
              <div className="relative h-[300px] sm:h-[350px] md:h-[380px] lg:h-[394px] overflow-hidden rounded-[40px] border border-white bg-gray-900 shadow-lg transition-all duration-300 hover:scale-[1.02] md:hover:scale-100 md:hover:shadow-[0px_0px_32px_0px_rgba(136,207,248,1)]">
                {/* Background Image */}
                {featuredProject.previewImage ? (
                  <img
                    src={featuredProject.previewImage}
                    alt={featuredProject.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-orange-300" />
                )}

                {/* Dark Gradient Overlay - Figma exact gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00003F] from-[10%] via-[#00003F]/0 via-[55%] to-transparent" />

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:px-12 md:py-10">
                  {/* Framework Tag - Top Right */}
                  {featuredProject.framework && (
                    <div className="flex justify-end">
                      <span className="inline-block rounded-[40px] bg-[#00003F] px-3 py-2 text-[14px] font-normal text-white sm:px-4 sm:py-2.5 md:px-4 md:py-3 md:text-[16px]">
                        {featuredProject.framework}
                      </span>
                    </div>
                  )}

                  {/* Project Info - Bottom */}
                  <div className="flex flex-col gap-1 md:gap-4">
                    <h3 className="font-[Nutmeg] text-[22px] font-semibold text-white sm:text-[26px] md:text-[28px] lg:text-[32px]">
                      {featuredProject.title}
                    </h3>
                    <p className="font-[Nutmeg] line-clamp-2 text-[15px] leading-[1.2] text-white font-light sm:text-[16px] md:max-w-[622px] md:text-[17px] lg:text-[18px]">
                      {featuredProject.shortDescription ||
                        featuredProject.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Other Projects - Grid */}
          <div className="flex flex-col gap-8 sm:gap-10 md:grid md:grid-cols-2 md:gap-8 lg:gap-10 xl:gap-12">
            {otherProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block"
              >
                <div className="relative h-[300px] sm:h-[350px] md:aspect-square md:h-auto overflow-hidden rounded-[40px] border border-white bg-gray-900 shadow-lg transition-all duration-300 hover:scale-[1.02] md:hover:scale-100 md:hover:shadow-[0px_0px_32px_0px_rgba(136,207,248,1)]">
                  {/* Background Image */}
                  {project.previewImage ? (
                    <img
                      src={project.previewImage}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-orange-300" />
                  )}

                  {/* Dark Gradient Overlay - Figma exact gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00003F] from-[10%] via-[#00003F]/0 via-[55%] to-transparent" />

                  {/* Content Container */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-8 lg:p-10 xl:px-12 xl:py-10">
                    {/* Framework Tag - Top Right */}
                    {project.framework && (
                      <div className="flex justify-end">
                        <span className="inline-block rounded-[40px] bg-[#00003F] px-3 py-2 text-[14px] font-normal text-white sm:px-4 sm:py-2.5 md:px-4 md:py-3 md:text-[16px]">
                          {project.framework}
                        </span>
                      </div>
                    )}

                    {/* Project Info - Bottom */}
                    <div className="flex flex-col gap-1 md:gap-2 lg:gap-4">
                      <h3 className="font-[Nutmeg] text-[22px] font-semibold text-white sm:text-[26px] md:text-[24px] lg:text-[28px] xl:text-[32px]">
                        {project.title}
                      </h3>
                      <p className="font-[Nutmeg] line-clamp-2 text-[15px] leading-[1.2] text-white font-light sm:text-[16px] md:text-[16px] lg:text-[17px] xl:text-[18px]">
                        {project.shortDescription || project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-[18px] py-16 sm:px-8 md:px-12 lg:px-20 xl:px-40 2xl:px-[323px] md:py-20 lg:py-24 xl:py-[100px]">
        <div className="mx-auto max-w-[354px] sm:max-w-[500px] md:max-w-none flex flex-col gap-6 md:flex-row md:items-center md:gap-8 lg:gap-12">
          <div className="flex flex-col gap-2 md:flex-1 md:gap-4">
            <h2 className="font-[Nutmeg] text-[26px] leading-none font-semibold text-blue-200 sm:text-[32px] md:text-[36px] lg:text-[42px] xl:text-[48px]">
              Like what you see?
            </h2>
            <p className="font-[Nutmeg] text-[22px] leading-none font-light text-white sm:text-[24px] md:text-[26px] lg:text-[30px] xl:text-[32px]">
              Don't hesitate to contact me right away!
            </p>
          </div>
          <Link href="/contact" className="w-full sm:w-auto md:w-auto">
            <button className="bg-primary flex w-full sm:w-auto items-center justify-center gap-2 rounded-[80px] py-4 px-8 text-[20px] font-normal text-white transition-all hover:bg-blue-600 active:scale-[0.98] sm:px-12 md:h-[68px] md:px-16 lg:px-20 xl:px-[100px] md:gap-4 md:text-[20px] lg:text-[24px] whitespace-nowrap">
              Let's talk now!
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" />
              </svg>
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
