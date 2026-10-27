import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { requireOwner } from "@/lib/auth/require-owner";

function isFileKey(value: unknown): value is string {
  return (
    typeof value === "string" && value.trim().length > 0 && value.length <= 256
  );
}

export async function POST(request: NextRequest) {
  if (!(await requireOwner())) {
    return NextResponse.json(
      { error: "Owner access required" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const fileKey =
    body && typeof body === "object" && "fileKey" in body
      ? body.fileKey
      : undefined;
  if (
    !(
      isFileKey(fileKey) ||
      (Array.isArray(fileKey) &&
        fileKey.length > 0 &&
        fileKey.length <= 100 &&
        fileKey.every(isFileKey))
    )
  ) {
    return NextResponse.json(
      {
        error: "Provide 1-100 non-empty file keys, each at most 256 characters",
      },
      { status: 400 },
    );
  }

  try {
    const utapi = new UTApi();
    await utapi.deleteFiles(fileKey);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
