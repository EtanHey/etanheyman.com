import { PrismaClient } from '../lib/generated/prisma';
import projectData from '../app/projects/hand-detection/project.json';

const prisma = new PrismaClient();

async function uploadHandDetectionProject() {
  try {
    // Check if project already exists
    const existingProject = await prisma.project.findFirst({
      where: {
        title: projectData.title
      }
    });

    if (existingProject) {
      console.log('Project already exists, updating...');

      const updated = await prisma.project.update({
        where: { id: existingProject.id },
        data: {
          title: projectData.title,
          description: projectData.description.long,
          shortDescription: projectData.description.short,
          logoPath: '/projects/hand-detection/logo.png', // You'll need to add a logo
          logoUrl: '/projects/hand-detection/logo.png',
          previewImage: '/projects/hand-detection/preview.png', // You'll need to add a preview
          technologies: [
            ...projectData.tech_stack.ml_framework,
            ...projectData.tech_stack.training,
            ...projectData.tech_stack.deployment,
            ...projectData.tech_stack.frontend,
          ],
          projectJourney: projectData.timeline.map(item => ({
            title: item.milestone,
            description: item.description,
            imgUrl: null // You can add images later
          })),
          gitUrl: projectData.links.github,
          liveUrl: projectData.links.demo,
          framework: 'ML/AI',
          featured: true
        }
      });

      console.log('Project updated successfully:', updated.id);
    } else {
      // Create new project
      const newProject = await prisma.project.create({
        data: {
          title: projectData.title,
          description: projectData.description.long,
          shortDescription: projectData.description.short,
          logoPath: '/projects/hand-detection/logo.png', // You'll need to add a logo
          logoUrl: '/projects/hand-detection/logo.png',
          previewImage: '/projects/hand-detection/preview.png', // You'll need to add a preview
          technologies: [
            ...projectData.tech_stack.ml_framework,
            ...projectData.tech_stack.training,
            ...projectData.tech_stack.deployment,
            ...projectData.tech_stack.frontend,
          ],
          projectJourney: projectData.timeline.map(item => ({
            title: item.milestone,
            description: item.description,
            imgUrl: null // You can add images later
          })),
          gitUrl: projectData.links.github,
          liveUrl: projectData.links.demo,
          framework: 'ML/AI',
          featured: true
        }
      });

      console.log('Project created successfully:', newProject.id);
    }
  } catch (error) {
    console.error('Error uploading project:', error);
  } finally {
    await prisma.$disconnect();
  }
}

uploadHandDetectionProject();