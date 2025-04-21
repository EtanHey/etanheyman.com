"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    logoPath: "/images/projects/default-logo.png",
    gitUrl: "",
    liveUrl: "",
    projectJourney: [
      {
        title: "Planning",
        description: "Initial project planning and requirements gathering.",
        imgUrl: "/images/projects/default-journey.jpg",
      },
    ],
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

  const addJourneyStep = () => {
    setFormData((prev) => ({
      ...prev,
      projectJourney: [
        ...prev.projectJourney,
        {
          title: "",
          description: "",
          imgUrl: "/images/projects/default-journey.jpg",
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
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();
      router.push(`/projects/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/projects"
        className="text-primary mb-8 inline-block hover:underline"
      >
        ← Back to Projects
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
              Logo Path
            </label>
            <input
              type="text"
              id="logoPath"
              name="logoPath"
              required
              value={formData.logoPath}
              onChange={handleChange}
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
                    Image URL (optional)
                  </label>
                  <input
                    type="text"
                    value={step.imgUrl || ""}
                    onChange={(e) =>
                      handleJourneyChange(index, "imgUrl", e.target.value)
                    }
                    className="border-border w-full rounded-md border p-2"
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

          <Link href="/projects">
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
