import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import { ProjectCard } from "@/app/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects | Etan Heyman",
  description:
    "Open-source projects by Etan Heyman: BrainLayer (AI memory), VoiceLayer (voice I/O), Golems (autonomous agents), and more.",
  alternates: { canonical: "/projects" },
};

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
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            priority={index < 6}
            className="h-[400px]"
          />
        ))}
      </div>
    </main>
  );
}
