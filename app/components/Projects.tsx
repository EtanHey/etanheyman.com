import { getAllProjects } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";

const Projects = async () => {
  let projects = [];

  try {
    projects = await getAllProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    // Return error UI instead of throwing
    return (
      <div className="col-span-full flex h-[300px] flex-col items-center justify-center rounded-[40px] bg-gradient-to-br from-red-100 to-red-200 text-center">
        <p className="mb-2 text-xl font-medium text-red-600">
          Failed to load projects
        </p>
        <p className="text-sm text-red-500">
          Please check your database connection
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
      {projects.map((project, index) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="group relative block"
        >
          {/* Card container matching Figma design */}
          <div
            className="relative h-[300px] overflow-hidden rounded-[40px] border-2 border-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            style={{
              backgroundImage: project.previewImage ? `url(${project.previewImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Gradient overlay from transparent to dark blue */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[55%] to-[#00003F] to-[90%]" />
            
            {/* Content container */}
            <div className="relative flex h-full flex-col items-end justify-between p-6">
              {/* Tag - top right */}
              <div className="rounded-[40px] bg-[#00003F] px-2 py-2">
                <span className="font-[Nutmeg] text-[14px] font-normal leading-[1.2] text-white">
                  Webi
                </span>
              </div>

              {/* Title & Description - bottom right, fixed width */}
              <div className="w-[306px] max-w-full">
                <h3 className="font-[Nutmeg] text-[22px] font-semibold leading-[1.2] text-white">
                  {project.title}
                </h3>
                <p className="mt-1 font-[Nutmeg] text-[15px] font-light leading-[1.2] text-white">
                  {project.shortDescription || project.description}
                </p>
              </div>
            </div>

            {/* Fallback for no image */}
            {!project.previewImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-[#00003F]">
                <span className="text-xl font-light text-white/50">
                  No preview
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}

      {/* Show message if no projects */}
      {projects.length === 0 && (
        <div className="col-span-full flex h-[300px] flex-col items-center justify-center rounded-[40px] border-2 border-white bg-gradient-to-br from-blue-900 to-[#00003F] text-center">
          <p className="text-xl font-medium text-white">No projects yet</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
