import { deleteProject, getProjectById, updateProject, type Project } from "@/lib/projects";
import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth/require-owner";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  if (!(await requireOwner())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const updatedProject = await updateProject(
      id,
      body as Partial<Omit<Project, "id" | "created_at" | "updated_at">>,
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
  if (!(await requireOwner())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }
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
