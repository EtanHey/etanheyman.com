import { getAllProjects } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Define background colors for projects - matching the design
const projectBackgrounds = [
  "bg-gradient-to-br from-blue-400/20 to-blue-500/20", // Beili
  "bg-gradient-to-br from-purple-400/20 to-pink-400/20", // Sharon Fitness  
  "bg-gradient-to-br from-yellow-400/20 to-orange-400/20", // Ofek Fitness
  "bg-gradient-to-br from-blue-400/20 to-purple-400/20", // Casona Diez Diez
  "bg-gradient-to-br from-green-400/20 to-blue-400/20", // Mayart
];

const Projects = async () => {
  let projects = [];
  
  try {
    projects = await getAllProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    // Return error UI instead of throwing
    return (
      <div className="col-span-full flex aspect-[4/3] flex-col items-center justify-center rounded-[24px] bg-gradient-to-br from-red-100 to-red-200 text-center lg:rounded-[32px]">
        <p className="mb-2 text-xl font-medium text-red-600">Failed to load projects</p>
        <p className="text-sm text-red-500">Please check your database connection</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      {projects.map((project, index) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="group relative block"
        >
          {/* Card container with backdrop blur effect */}
          <div className={`relative overflow-hidden rounded-[24px] ${
            projectBackgrounds[index % projectBackgrounds.length]
          } backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl lg:rounded-[32px]`}>
            <div className="relative aspect-[4/3]">
              {/* Label */}
              <div className="absolute right-4 top-4 z-10 rounded-full bg-black/80 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white lg:px-4 lg:text-xs">
                Web
              </div>
              
              {/* Project Images */}
              {project.previewImage ? (
                <div className="relative h-full w-full p-6 lg:p-8">
                  <Image
                    src={project.previewImage}
                    alt={`${project.title} preview`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-8">
                  <span className="text-xl font-light text-blue-200">
                    No preview
                  </span>
                </div>
              )}
              
              {/* Project Info - bottom overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 lg:p-8">
                <h3 className="mb-1 text-lg font-semibold text-white lg:text-xl">
                  {project.title}
                </h3>
                <p className="line-clamp-2 text-sm text-white/70 lg:text-base">
                  {project.shortDescription || project.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* Show message if no projects */}
      {projects.length === 0 && (
        <div className="col-span-full flex aspect-[4/3] flex-col items-center justify-center rounded-[32px] bg-white/5 backdrop-blur-md border border-white/10 text-center">
          <p className="text-xl font-medium text-blue-200">No projects yet</p>
        </div>
      )}
    </div>
  );
};

export default Projects;