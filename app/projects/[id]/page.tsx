import { getProjectById } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminEditButton from "@/app/components/AdminEditButton";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-primary inline-block hover:underline"
        >
          ← Back to Home
        </Link>

        <AdminEditButton projectId={id} />
      </div>

      <div className="mb-8">
        {project.previewImage && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <Image
              src={project.previewImage}
              alt={`${project.title} preview`}
              width={1200}
              height={600}
              className="w-full object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center gap-6">
          {project.logoUrl && (
            <Image
              src={project.logoUrl}
              alt={`${project.title} logo`}
              width={80}
              height={80}
              className="object-contain"
            />
          )}
          <h1 className="text-4xl font-bold">{project.title}</h1>
        </div>
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

      {project.technologies && project.technologies.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

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
