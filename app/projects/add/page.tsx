"use client";
import ImageUploader from "@/app/components/ImageUploader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ProjectJourneyStep = {
  title: string;
  description: string;
  imgUrl: string;
  fileKey?: string;
};

export default function AddProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    logoPath: "",
    logoUrl: "",
    logoFileKey: "",
    previewImage: "",
    previewImageFileKey: "",
    technologies: [] as string[],
    gitUrl: "",
    liveUrl: "",
    projectJourney: [
      {
        title: "Planning",
        description: "Initial project planning and requirements gathering.",
        imgUrl: "",
        fileKey: "",
      },
    ] as ProjectJourneyStep[],
  });

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
    setFormData((prev) => ({
      ...prev,
      logoPath: url,
      logoUrl: url,
      logoFileKey: fileKey || "",
    }));
  };

  const handlePreviewImageChange = (url: string, fileKey?: string) => {
    setFormData((prev) => ({
      ...prev,
      previewImage: url,
      previewImageFileKey: fileKey || "",
    }));
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const techs = e.target.value.split(",").map((tech) => tech.trim());
    setFormData((prev) => ({ ...prev, technologies: techs }));
  };

  const handleJourneyImageChange = (
    index: number,
    url: string,
    fileKey?: string,
  ) => {
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
    setFormData((prev) => ({
      ...prev,
      projectJourney: prev.projectJourney.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      // Prepare data matching Prisma schema
      const projectData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        logoPath: formData.logoPath,
        logoUrl: formData.logoUrl,
        previewImage: formData.previewImage,
        technologies: formData.technologies,
        gitUrl: formData.gitUrl,
        liveUrl: formData.liveUrl,
        projectJourney: formData.projectJourney.map(step => ({
          title: step.title,
          description: step.description,
          imgUrl: step.imgUrl
        }))
      };
      
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();
      toast.success("Project created successfully!");
      router.push(`/projects/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-primary mb-8 inline-block hover:underline"
      >
        ← Back to Home
      </Link>

      <h1 className="mb-8 text-3xl font-bold">Add New Project</h1>

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
            <label htmlFor="previewImage" className="mb-1 block font-medium">
              Preview Image (for homepage)
            </label>
            <ImageUploader
              endpoint="journeyImage"
              value={formData.previewImage}
              onChange={handlePreviewImageChange}
            />
          </div>

          <div>
            <label htmlFor="technologies" className="mb-1 block font-medium">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              placeholder="React, Next.js, TypeScript, Tailwind CSS"
              value={formData.technologies.join(", ")}
              onChange={handleTechnologiesChange}
              className="border-border w-full rounded-md border p-2"
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
            {isSubmitting ? "Creating..." : "Create Project"}
          </button>

          <Link href="/">
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
