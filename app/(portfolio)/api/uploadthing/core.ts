import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { requireOwner } from "@/lib/auth/require-owner";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define routes for project logo and journey images
  projectLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      if (!(await requireOwner())) {
        throw new UploadThingError({ code: "FORBIDDEN", message: "Unauthorized" });
      }
      return { projectType: "logo" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for logo", file.url);

      // Return file info to the client
      return { fileUrl: file.url, fileKey: file.key };
    }),

  journeyImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      if (!(await requireOwner())) {
        throw new UploadThingError({ code: "FORBIDDEN", message: "Unauthorized" });
      }
      return { projectType: "journey" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for journey image", file.url);

      // Return file info to the client
      return { fileUrl: file.url, fileKey: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
