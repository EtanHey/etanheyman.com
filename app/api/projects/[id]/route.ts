import type { Project } from "@/lib/generated/prisma";
import { deleteProject, getProjectById, updateProject } from "@/lib/projects";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`Error in GET /api/projects/${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updatedProject = await updateProject(
      id,
      body as Partial<Omit<Project, "id">>,
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(`Error in PATCH /api/projects/${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteProject(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error in DELETE /api/projects/${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
