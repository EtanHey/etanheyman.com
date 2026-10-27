import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { requireOwner } from "@/lib/auth/require-owner";
import { matchesImageMime } from "../image-content";
import { imageUploadConfig } from "../image-types";

const utapi = new UTApi();

export async function POST(request: NextRequest) {
  try {
    if (!(await requireOwner())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const formData = await request.formData();
    const file = formData.get("file");
    const endpoint = formData.get("endpoint");

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

    if (
      typeof file === "string" ||
      formData.getAll("file").length !== 1 ||
      formData.getAll("endpoint").length !== 1 ||
      Array.from(formData.values()).filter(value => typeof value !== "string").length !== 1
    ) {
      return NextResponse.json(
        { error: "Upload exactly one image" },
        { status: 400 },
      );
    }

    if (!Object.hasOwn(imageUploadConfig[endpoint], file.type)) {
      return NextResponse.json({ error: "Unsupported image type for this upload" }, { status: 400 });
    }
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be 4MB or smaller" }, { status: 400 });
    }
    if (!(await matchesImageMime(file))) {
      return NextResponse.json({ error: "Image content does not match its type" }, { status: 400 });
    }

    // Upload file
    const uploadedFile = await utapi.uploadFiles(file);

    if (!uploadedFile.data) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 },
      );
    }

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
