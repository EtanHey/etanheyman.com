import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function updateHandDetectionProject() {
  try {
    // Find the hand-detection project
    const project = await prisma.project.findFirst({
      where: {
        title: "Hand Sign Detection Model"
      }
    });

    if (!project) {
      console.log('Project not found');
      return;
    }

    // Update with simplified technology names that might have icons
    // or are commonly recognizable
    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        logoPath: '/images/projects/hand-detection-logo.svg',
        logoUrl: '/images/projects/hand-detection-logo.svg',
        previewImage: '/images/projects/hand-detection-logo.svg', // Using logo as preview for now
        technologies: [
          'Python',
          'PyTorch',
          'YOLOv8',
          'React',
          'Next.js',
          'FastAPI',
          'HuggingFace',
          'Docker',
        ],
      }
    });

    console.log('Project updated successfully');
    console.log('Updated technologies:', updated.technologies);
    console.log('Logo path:', updated.logoPath);
  } catch (error) {
    console.error('Error updating project:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateHandDetectionProject();