import { prisma as db } from "@/lib/db";
import Link from "next/link";
import AdminEditButton from "../components/AdminEditButton";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="flex min-h-screen w-full flex-col px-6 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-white">All Projects</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              <Link href={`/projects/${project.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-white bg-gray-800 transition-transform hover:scale-[1.02]">
                  {project.previewImage ? (
                    <img
                      src={project.previewImage}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-orange-300" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  {project.framework && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-block rounded bg-yellow-400 px-1.5 py-0.5 text-[9px] font-bold text-black uppercase">
                        {project.framework}
                      </span>
                    </div>
                  )}

                  <div className="absolute right-0 bottom-0 left-0 p-4">
                    <h3 className="mb-1 text-base font-semibold text-white">
                      {project.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-white/70">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="absolute top-2 right-2">
                <AdminEditButton projectId={project.id} />
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-white/50">
              No projects yet. Add your first project!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
