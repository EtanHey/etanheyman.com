import { createClient } from "./supabase/server";

// Database types (snake_case from Supabase)
export interface ProjectDB {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  short_description: string;
  logo_path: string;
  logo_url: string | null;
  preview_image: string | null;
  technologies: string[];
  git_url: string;
  live_url: string | null;
  docs_url: string | null;
  framework: string | null;
  featured: boolean;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectJourneyStepDB {
  id: string;
  project_id: string;
  title: string;
  description: string;
  img_url: string | null;
  step_order: number;
  created_at: string;
}

// Frontend types (camelCase for TypeScript)
export interface Project {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  shortDescription: string;
  logoPath: string;
  logoUrl: string | null;
  previewImage: string | null;
  technologies: string[];
  gitUrl: string;
  liveUrl: string | null;
  docsUrl: string | null;
  framework: string | null;
  featured: boolean;
  orderIndex: number | null;
  createdAt: string;
  updatedAt: string;
  projectJourney?: ProjectJourneyStep[];
}

export interface ProjectJourneyStep {
  id: string;
  projectId: string;
  title: string;
  description: string;
  imgUrl: string | null;
  stepOrder: number;
  createdAt: string;
}

// Mappers
function mapProjectFromDB(dbProject: ProjectDB, journeySteps?: ProjectJourneyStepDB[]): Project {
  return {
    id: dbProject.id,
    slug: dbProject.slug,
    title: dbProject.title,
    description: dbProject.description,
    shortDescription: dbProject.short_description,
    logoPath: dbProject.logo_path,
    logoUrl: dbProject.logo_url,
    previewImage: dbProject.preview_image,
    technologies: dbProject.technologies,
    gitUrl: dbProject.git_url,
    liveUrl: dbProject.live_url,
    docsUrl: dbProject.docs_url,
    framework: dbProject.framework,
    featured: dbProject.featured,
    orderIndex: dbProject.order_index,
    createdAt: dbProject.created_at,
    updatedAt: dbProject.updated_at,
    projectJourney: journeySteps?.map(mapJourneyStepFromDB),
  };
}

function mapJourneyStepFromDB(dbStep: ProjectJourneyStepDB): ProjectJourneyStep {
  return {
    id: dbStep.id,
    projectId: dbStep.project_id,
    title: dbStep.title,
    description: dbStep.description,
    imgUrl: dbStep.img_url,
    stepOrder: dbStep.step_order,
    createdAt: dbStep.created_at,
  };
}

function mapProjectToDB(project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt" | "projectJourney">>): Partial<Omit<ProjectDB, "id" | "created_at" | "updated_at">> {
  const dbProject: any = {};
  if (project.title !== undefined) dbProject.title = project.title;
  if (project.description !== undefined) dbProject.description = project.description;
  if (project.shortDescription !== undefined) dbProject.short_description = project.shortDescription;
  if (project.logoPath !== undefined) dbProject.logo_path = project.logoPath;
  if (project.logoUrl !== undefined) dbProject.logo_url = project.logoUrl;
  if (project.previewImage !== undefined) dbProject.preview_image = project.previewImage;
  if (project.technologies !== undefined) dbProject.technologies = project.technologies;
  if (project.gitUrl !== undefined) dbProject.git_url = project.gitUrl;
  if (project.liveUrl !== undefined) dbProject.live_url = project.liveUrl;
  if (project.docsUrl !== undefined) dbProject.docs_url = project.docsUrl;
  if (project.framework !== undefined) dbProject.framework = project.framework;
  if (project.featured !== undefined) dbProject.featured = project.featured;
  if (project.orderIndex !== undefined) dbProject.order_index = project.orderIndex;
  return dbProject;
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return (data || []).map((dbProject: ProjectDB) => mapProjectFromDB(dbProject));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function getProjectBySlugOrId(slugOrId: string): Promise<Project | null> {
  // Try slug first, fall back to id
  const project = await getProjectBySlug(slugOrId);
  if (project) return project;
  return getProjectById(slugOrId);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient();
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (projectError) {
      if (projectError.code === 'PGRST116') return null;
      throw projectError;
    }

    const { data: journeyData, error: journeyError } = await supabase
      .from('project_journey_steps')
      .select('*')
      .eq('project_id', projectData.id)
      .order('step_order', { ascending: true });

    if (journeyError) throw journeyError;
    return mapProjectFromDB(projectData as ProjectDB, journeyData as ProjectJourneyStepDB[]);
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const supabase = await createClient();

    // Fetch project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError) {
      if (projectError.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw projectError;
    }

    // Fetch journey steps
    const { data: journeyData, error: journeyError } = await supabase
      .from('project_journey_steps')
      .select('*')
      .eq('project_id', id)
      .order('step_order', { ascending: true });

    if (journeyError) throw journeyError;

    return mapProjectFromDB(projectData as ProjectDB, journeyData as ProjectJourneyStepDB[]);
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    throw error;
  }
}

export async function getProjectJourneySteps(projectId: string): Promise<ProjectJourneyStep[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('project_journey_steps')
      .select('*')
      .eq('project_id', projectId)
      .order('step_order', { ascending: true });

    if (error) throw error;
    return (data || []).map((dbStep: ProjectJourneyStepDB) => mapJourneyStepFromDB(dbStep));
  } catch (error) {
    console.error(`Error fetching journey steps for project ${projectId}:`, error);
    throw error;
  }
}

export async function createProject(projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "projectJourney">) {
  try {
    const supabase = await createClient();
    const dbData = mapProjectToDB(projectData);
    const { data, error } = await supabase
      .from('projects')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return mapProjectFromDB(data as ProjectDB);
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(
  id: string,
  projectData: Partial<Omit<Project, "id" | "createdAt" | "updatedAt" | "projectJourney">>,
) {
  try {
    const supabase = await createClient();
    const dbData = mapProjectToDB(projectData);
    const { data, error } = await supabase
      .from('projects')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapProjectFromDB(data as ProjectDB);
  } catch (error) {
    console.error(`Error updating project with id ${id}:`, error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    throw error;
  }
}
