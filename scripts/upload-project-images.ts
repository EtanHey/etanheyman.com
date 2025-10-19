import { UTApi } from "uploadthing/server";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const utapi = new UTApi();

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

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  for (const { projectTitle, imagePath, imageType } of projectImages) {
    try {
      console.log(`Uploading ${imageType} for: ${projectTitle}`);

      // Read the file
      const fileBuffer = readFileSync(imagePath);
      const fileName = imagePath.split("/").pop() || "image";

      // Create a File object
      const file = new File([fileBuffer], fileName, {
        type: fileName.endsWith(".svg") ? "image/svg+xml" :
              fileName.endsWith(".png") ? "image/png" :
              "image/jpeg",
      });

      // Upload to UploadThing
      const response = await utapi.uploadFiles([file]);

      if (response[0].data) {
        const imageUrl = response[0].data.url;
        console.log(`✓ Uploaded successfully: ${imageUrl}`);

        // Update database
        const updateData = imageType === "logo"
          ? { logo_url: imageUrl, logo_path: imageUrl }
          : { preview_image: imageUrl };

        const { error } = await supabase
          .from("projects")
          .update(updateData)
          .eq("title", projectTitle);

        if (error) {
          console.error(`✗ Database update failed for ${projectTitle}:`, error.message);
        } else {
          console.log(`✓ Database updated for ${projectTitle}\n`);
        }
      } else {
        console.error(`✗ Upload failed for ${projectTitle}:`, response[0].error);
      }
    } catch (error) {
      console.error(`✗ Error processing ${projectTitle}:`, error);
    }
  }

  console.log("\nUpload process complete!");
}

uploadProjectImages();
