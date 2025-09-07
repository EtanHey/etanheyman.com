"use client";
import ImageUploader from "@/app/components/ImageUploader";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ProjectJourneyStep = {
  title: string;
  description: string;
  imgUrl: string;
  fileKey?: string;
};

type ProjectData = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  logoPath: string;
  logoFileKey?: string;
  gitUrl: string;
  liveUrl: string;
  projectJourney: ProjectJourneyStep[];
};

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalImages, setOriginalImages] = useState<{
    logo?: string;
    journeyImages: string[];
  }>({ logo: "", journeyImages: [] });

  const [formData, setFormData] = useState<ProjectData>({
    id: "",
    title: "",
    shortDescription: "",
    description: "",
    logoPath: "",
    logoFileKey: "",
    gitUrl: "",
    liveUrl: "",
    projectJourney: [] as ProjectJourneyStep[],
  });

  // Track images that have been changed during editing (to be deleted on save)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Fetch project data on page load
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${projectId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }

        const data = await response.json();
        setFormData(data);

        // Store original image paths for comparison on save
        setOriginalImages({
          logo: data.logoPath,
          journeyImages: data.projectJourney.map((step: any) => step.imgUrl),
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project. Please try again.");
        router.push("/");
      }
    }

    fetchProject();
  }, [projectId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJourneyChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedJourney = [...prev.projectJourney];
      updatedJourney[index] = { ...updatedJourney[index], [field]: value };
      return { ...prev, projectJourney: updatedJourney };
    });
  };

  const handleLogoChange = (url: string, fileKey?: string) => {
    // If replacing an existing image, add the old one to delete list
    if (
      formData.logoPath &&
      formData.logoPath !== url &&
      formData.logoPath.includes("uploadthing")
    ) {
      setImagesToDelete((prev) => [...prev, formData.logoPath]);
    }

    setFormData((prev) => ({
      ...prev,
      logoPath: url,
      logoFileKey: fileKey || "",
    }));
  };

  const handleJourneyImageChange = (
    index: number,
    url: string,
    fileKey?: string,
  ) => {
    // If replacing an existing image, add the old one to delete list
    const currentImgUrl = formData.projectJourney[index]?.imgUrl;
    if (
      currentImgUrl &&
      currentImgUrl !== url &&
      currentImgUrl.includes("uploadthing")
    ) {
      setImagesToDelete((prev) => [...prev, currentImgUrl]);
    }

    setFormData((prev) => {
      const updatedJourney = [...prev.projectJourney];
      updatedJourney[index] = {
        ...updatedJourney[index],
        imgUrl: url,
        fileKey: fileKey || "",
      };
      return { ...prev, projectJourney: updatedJourney };
    });
  };

  const addJourneyStep = () => {
    setFormData((prev) => ({
      ...prev,
      projectJourney: [
        ...prev.projectJourney,
        {
          title: "",
          description: "",
          imgUrl: "",
          fileKey: "",
        },
      ],
    }));
  };

  const removeJourneyStep = (index: number) => {
    // If removing a step with an image, add it to delete list
    const stepToRemove = formData.projectJourney[index];
    if (stepToRemove?.imgUrl && stepToRemove.imgUrl.includes("uploadthing")) {
      setImagesToDelete((prev) => [...prev, stepToRemove.imgUrl]);
    }

    setFormData((prev) => ({
      ...prev,
      projectJourney: prev.projectJourney.filter((_, i) => i !== index),
    }));
  };

  // Delete all images in the deletionQueue
  const deleteRemovedImages = async () => {
    if (imagesToDelete.length === 0) return;

    for (const imageUrl of imagesToDelete) {
      const fileKey = imageUrl.split("/").pop();
      if (fileKey) {
        try {
          await fetch("/api/uploadthing/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileKey }),
          });
        } catch (error) {
          console.error("Error deleting image:", error);
          // Continue with other deletions even if one fails
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      // Delete any images that were replaced during editing
      await deleteRemovedImages();

      toast.success("Project updated successfully!");
      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-xl">Loading project...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href={`/projects/${projectId}`}
        className="text-primary mb-8 inline-block hover:underline"
      >
        ← Back to Project
      </Link>

      <h1 className="mb-8 text-3xl font-bold">Edit Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block font-medium">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="border-border w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label
              htmlFor="shortDescription"
              className="mb-1 block font-medium"
            >
              Short Description
            </label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              required
              value={formData.shortDescription}
              onChange={handleChange}
              className="border-border w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block font-medium">
              Full Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="border-border w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label htmlFor="logoPath" className="mb-1 block font-medium">
              Project Logo
            </label>
            <ImageUploader
              endpoint="projectLogo"
              value={formData.logoPath}
              onChange={handleLogoChange}
            />
          </div>

          <div>
            <label htmlFor="gitUrl" className="mb-1 block font-medium">
              GitHub URL
            </label>
            <input
              type="url"
              id="gitUrl"
              name="gitUrl"
              required
              value={formData.gitUrl}
              onChange={handleChange}
              className="border-border w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label htmlFor="liveUrl" className="mb-1 block font-medium">
              Live Site URL (optional)
            </label>
            <input
              type="url"
              id="liveUrl"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              className="border-border w-full rounded-md border p-2"
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Project Journey</h2>

          {formData.projectJourney.map((step, index) => (
            <div
              key={index}
              className="border-border mb-4 rounded-md border p-4"
            >
              <div className="mb-2 flex justify-between">
                <h3 className="font-medium">Step {index + 1}</h3>
                {formData.projectJourney.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeJourneyStep(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-medium">Title</label>
                  <input
                    type="text"
                    required
                    value={step.title}
                    onChange={(e) =>
                      handleJourneyChange(index, "title", e.target.value)
                    }
                    className="border-border w-full rounded-md border p-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Description</label>
                  <textarea
                    required
                    value={step.description}
                    onChange={(e) =>
                      handleJourneyChange(index, "description", e.target.value)
                    }
                    rows={3}
                    className="border-border w-full rounded-md border p-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">
                    Journey Image
                  </label>
                  <ImageUploader
                    endpoint="journeyImage"
                    value={step.imgUrl}
                    onChange={(url, fileKey) =>
                      handleJourneyImageChange(index, url, fileKey)
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addJourneyStep}
            className="text-primary mb-6 hover:underline"
          >
            + Add Another Step
          </button>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-2"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

          <Link href={`/projects/${projectId}`}>
            <button
              type="button"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-6 py-2"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}
