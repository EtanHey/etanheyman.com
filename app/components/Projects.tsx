import { getAllProjects } from "@/lib/projects";
import React from "react";

const Projects = async () => {
  const projects = await getAllProjects();

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
};

export default Projects;
