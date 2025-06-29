import { prisma } from "./db";
import type { Project } from "./generated/prisma";

export async function getAllProjects() {
  try {
    return await prisma.project.findMany();
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    return await prisma.project.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    throw error;
  }
}

export async function createProject(projectData: Omit<Project, "id">) {
  try {
    return await prisma.project.create({
      data: projectData,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(
  id: string,
  projectData: Partial<Omit<Project, "id">>,
) {
  try {
    return await prisma.project.update({
      where: { id },
      data: projectData,
    });
  } catch (error) {
    console.error(`Error updating project with id ${id}:`, error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    return await prisma.project.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    throw error;
  }
}
