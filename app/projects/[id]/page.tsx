"use client";
import { getProjectById } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

export default async function ProjectPage() {
  const { id } = useParams();
  if (!id || typeof id !== "string") {
    notFound();
  }
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/projects"
        className="text-primary mb-8 inline-block hover:underline"
      >
        ← Back to Projects
      </Link>

      <div className="mb-8 flex items-center">
        <Image
          src={project.logoPath}
          alt={`${project.title} logo`}
          width={80}
          height={80}
          className="mr-6 object-contain"
        />
        <h1 className="text-4xl font-bold">{project.title}</h1>
      </div>

      <div className="mb-8 flex gap-4">
        <a
          href={project.gitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
        >
          GitHub Repository
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
          >
            Live Site
          </a>
        )}
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Description</h2>
        <p className="text-lg whitespace-pre-line">{project.description}</p>
      </div>

      {project.projectJourney && project.projectJourney.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Project Journey</h2>
          <div className="space-y-12">
            {project.projectJourney.map((journey, index) => (
              <div key={index} className="grid gap-8 md:grid-cols-2">
                <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <h3 className="mb-2 text-xl font-medium">{journey.title}</h3>
                  <p className="whitespace-pre-line">{journey.description}</p>
                </div>
                {journey.imgUrl && (
                  <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                    <Image
                      src={journey.imgUrl}
                      alt={journey.title}
                      width={600}
                      height={400}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
