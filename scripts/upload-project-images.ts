import { UTApi } from "uploadthing/server";
import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// Check environment variables
if (!process.env.UPLOADTHING_TOKEN) {
  console.error("ERROR: UPLOADTHING_TOKEN not found");
  process.exit(1);
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("ERROR: Supabase credentials not found");
  process.exit(1);
}

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

interface ProjectImage {
  projectTitle: string;
  imagePath: string;
  imageType: "logo" | "preview";
}

const projectImages: ProjectImage[] = [
  {
    projectTitle: "Sharon Fitness",
    imagePath: "/Users/etanheyman/Desktop/Gits/sharon-fitness/public/assets/sharon-fitness-logo.png",
    imageType: "logo",
  },
  {
    projectTitle: "Beili Photographer Portfolio",
    imagePath: "/Users/etanheyman/Desktop/Gits/beili-photographer/public/images/beili-logo.png",
    imageType: "logo",
  },
  {
    projectTitle: "Casona diez diez",
    imagePath: "/Users/etanheyman/Desktop/Gits/casona_diez_diez/public/android-chrome-512x512.png",
    imageType: "logo",
  },
  {
    projectTitle: "OFEKTIVE Fitness Studio",
    imagePath: "/Users/etanheyman/Desktop/Gits/ofektive/public/main_logo.svg",
    imageType: "logo",
  },
  {
    projectTitle: "Union - Cantaloupe AI Recruitment Platform",
    imagePath: "/Users/etanheyman/Desktop/Gits/union/public/cantaloupeTeam.jpeg",
    imageType: "logo",
  },
  {
    projectTitle: "Domica - Rental Listing Visualization Platform",
    imagePath: "/Users/etanheyman/Desktop/Gits/domica/public/domica_logo.png",
    imageType: "logo",
  },
];

async function uploadProjectImages() {
  console.log("Starting upload of project images...\n");
  console.log(`Found ${projectImages.length} images to upload\n`);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  for (const { projectTitle, imagePath, imageType } of projectImages) {
    try {
      console.log(`[${projectTitle}] Checking file: ${imagePath}`);

      if (!existsSync(imagePath)) {
        console.error(`✗ File not found: ${imagePath}\n`);
        continue;
      }

      // Read the file
      const fileBuffer = readFileSync(imagePath);
      const fileName = imagePath.split("/").pop() || "image";
      console.log(`[${projectTitle}] File size: ${fileBuffer.length} bytes`);

      // Create a File object
      const file = new File([fileBuffer], fileName, {
        type: fileName.endsWith(".svg") ? "image/svg+xml" :
              fileName.endsWith(".png") ? "image/png" :
              "image/jpeg",
      });

      console.log(`[${projectTitle}] Uploading to UploadThing...`);

      // Upload to UploadThing
      const response = await utapi.uploadFiles([file]);

      if (response[0].data) {
        const imageUrl = response[0].data.url;
        console.log(`✓ Uploaded successfully: ${imageUrl}`);

        // Update database
        const updateData = imageType === "logo"
          ? { logo_url: imageUrl, logo_path: imageUrl, preview_image: imageUrl }
          : { preview_image: imageUrl };

        const { error } = await supabase
          .from("projects")
          .update(updateData)
          .ilike("title", `%${projectTitle}%`);

        if (error) {
          console.error(`✗ Database update failed for ${projectTitle}:`, error.message);
        } else {
          console.log(`✓ Database updated for ${projectTitle}\n`);
        }
      } else {
        console.error(`✗ Upload failed for ${projectTitle}:`, response[0].error);
        console.error(`Full response:`, JSON.stringify(response, null, 2));
      }
    } catch (error) {
      console.error(`✗ Error processing ${projectTitle}:`, error);
    }
  }

  console.log("\n=== Upload process complete! ===");
}

uploadProjectImages();
