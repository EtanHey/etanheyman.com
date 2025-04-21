import type { Project } from "@/lib/generated/prisma";
import { deleteProject, getProjectById, updateProject } from "@/lib/projects";
import { NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const project = await getProjectById(params.id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`Error in GET /api/projects/${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const updatedProject = await updateProject(
      params.id,
      body as Partial<Omit<Project, "id">>,
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(`Error in PATCH /api/projects/${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await deleteProject(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error in DELETE /api/projects/${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
