import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const endpoint = formData.get("endpoint") as string;

    if (!file || !endpoint) {
      return NextResponse.json(
        { error: "File and endpoint are required" },
        { status: 400 },
      );
    }

    // Check if endpoint is valid
    if (endpoint !== "projectLogo" && endpoint !== "journeyImage") {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }

    // Upload file
    const uploadedFile = await utapi.uploadFiles(file);

    return NextResponse.json({
      url: uploadedFile.data.url,
      key: uploadedFile.data.key,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
