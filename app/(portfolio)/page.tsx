import { getAllProjects } from "@/lib/projects";
import Link from "next/link";
import Me from "@/app/components/Me";
import { ArrowRight } from "lucide-react";
import {
  FeaturedProjectCard,
  HomeProjectCard,
} from "@/app/components/ProjectCard";
import GolemsEcosystem from "@/app/components/GolemsEcosystem";

export default async function Home() {
  // Fetch all projects
  const allProjects = await getAllProjects();
  const projects = allProjects.slice(0, 5);

  // Find featured project or use first one
  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const otherProjects = projects.filter((p) => p.id !== featuredProject?.id);

  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <section className="flex flex-col px-[18px] pt-[80px] pb-6 sm:px-8 sm:pt-[60px] md:px-12 md:pt-[50px] md:pb-8 lg:px-20 lg:pt-20 xl:px-40 2xl:px-[323px]">
        <div className="mx-auto w-full max-w-[354px] sm:max-w-[500px] md:flex md:max-w-none md:items-center md:justify-between md:gap-8">
          {/* Content Container */}
          <div className="flex flex-col gap-4 md:max-w-[645px] md:flex-1 md:gap-8">
            {/* Profile Image - Mobile Only */}
            <div className="mb-6 h-[100px] w-[100px] sm:mb-8 md:hidden">
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
            <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row md:mt-0 md:gap-4 lg:gap-8">
              <Link href="#projects" className="w-full sm:w-auto">
                <button className="bg-primary flex w-full items-center justify-center gap-2 rounded-[80px] px-6 py-4 text-[20px] font-normal whitespace-nowrap text-white transition-all hover:bg-blue-600 active:scale-[0.98] sm:w-auto sm:px-8 md:h-[68px] md:gap-4 md:px-12 md:text-[20px] lg:px-16 lg:text-[24px]">
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
              <Link href="/about" className="w-full sm:w-auto">
                <button className="hover:border-primary flex w-full items-center justify-center rounded-[80px] border-2 border-blue-300 bg-transparent px-6 py-4 text-[20px] font-normal whitespace-nowrap text-blue-300 transition-all hover:bg-blue-300/10 active:scale-[0.98] sm:w-auto sm:px-8 md:h-[68px] md:px-12 md:text-[20px] lg:px-16 lg:text-[24px]">
                  About me
                </button>
              </Link>
            </div>
          </div>

          {/* Profile Image - Desktop Only */}
          <div className="hidden flex-shrink-0 md:block md:h-[300px] md:w-[300px] lg:h-[400px] lg:w-[400px] xl:h-[468px] xl:w-[468px]">
            <Me />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="scroll-mt-[80px] px-[18px] pt-10 pb-8 sm:scroll-mt-[60px] sm:px-8 md:scroll-mt-[40px] md:px-12 md:pt-12 md:pb-8 lg:scroll-mt-[20px] lg:px-20 lg:pt-16 lg:pb-10 xl:px-40 xl:pt-20 xl:pb-12 2xl:px-[323px]"
      >
        <div className="mx-auto max-w-[354px] space-y-6 sm:max-w-[500px] sm:space-y-8 md:max-w-none md:space-y-10">
          {/* Featured Project - Full Width */}
          {featuredProject && <FeaturedProjectCard project={featuredProject} />}

          {/* Other Projects - Grid */}
          <div className="flex flex-col gap-8 sm:gap-10 md:grid md:grid-cols-2 md:gap-8 lg:gap-10 xl:gap-12">
            {otherProjects.map((project) => (
              <HomeProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* View All Projects Button */}
          <div className="flex justify-center pt-2">
            <Link href="/projects">
              <button className="bg-primary flex items-center justify-center gap-2 rounded-[80px] px-8 py-4 text-[18px] font-normal whitespace-nowrap text-white transition-all hover:bg-blue-600 active:scale-[0.98] sm:px-12 md:h-[60px] md:px-16 md:text-[20px]">
                View All Projects
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Golems Ecosystem Section */}
      <GolemsEcosystem />

      {/* CTA Section */}
      <section className="px-[18px] pt-6 pb-12 sm:px-8 md:px-12 md:pt-8 md:pb-16 lg:px-20 lg:pt-12 lg:pb-20 xl:px-40 xl:pt-14 xl:pb-24 2xl:px-[323px]">
        <div className="mx-auto flex max-w-[354px] flex-col gap-6 sm:max-w-[500px] md:max-w-none md:flex-row md:items-center md:gap-8 lg:gap-12">
          <div className="flex flex-col gap-2 md:flex-1 md:gap-4">
            <h2 className="font-[Nutmeg] text-[26px] leading-none font-semibold text-blue-200 sm:text-[32px] md:text-[36px] lg:text-[42px] xl:text-[48px]">
              Like what you see?
            </h2>
            <p className="font-[Nutmeg] text-[22px] leading-none font-light text-white sm:text-[24px] md:text-[26px] lg:text-[30px] xl:text-[32px]">
              Don't hesitate to contact me right away!
            </p>
          </div>
          <Link href="/contact" className="w-full sm:w-auto md:w-auto">
            <button className="bg-primary flex w-full items-center justify-center gap-2 rounded-[80px] px-8 py-4 text-[20px] font-normal whitespace-nowrap text-white transition-all hover:bg-blue-600 active:scale-[0.98] sm:w-auto sm:px-12 md:h-[68px] md:gap-4 md:px-16 md:text-[20px] lg:px-20 lg:text-[24px] xl:px-[100px]">
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
