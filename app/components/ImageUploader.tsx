"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

type ImageUploaderProps = {
  endpoint: "projectLogo" | "journeyImage";
  value?: string;
  onChange: (url: string, fileKey?: string) => void;
  onDelete?: (fileKey?: string) => void;
  className?: string;
};

export default function ImageUploader({
  endpoint,
  value,
  onChange,
  onDelete,
  className = "",
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFileKey, setCurrentFileKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);

      // Create FormData for the upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("endpoint", endpoint);

      // Start upload immediately using our direct upload endpoint
      const res = await fetch(`/api/uploadthing/direct`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();

      setPreview(data.url);
      // Store the file key for deletion
      setCurrentFileKey(data.key);
      onChange(data.url, data.key);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleUpload(file);
      } else {
        toast.error("Only image files are allowed");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsDeleting(true);

      // Use stored fileKey instead of trying to extract from URL
      const fileKey =
        currentFileKey ||
        (value?.includes("uploadthing") ? value?.split("/").pop() : null);

      console.log("Deleting file with key:", fileKey);

      // Only call the API if we have a fileKey from uploadthing
      if (fileKey) {
        const response = await fetch("/api/uploadthing/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileKey }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete file");
        }
      }

      // Notify parent component
      if (onDelete && fileKey) {
        onDelete(fileKey);
      }

      // Update local state and parent
      setPreview(null);
      setCurrentFileKey(null);
      onChange("", "");
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(
        `Failed to remove image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`relative  h-48 ${className}`}>
      {preview ? (
        <div className="relative mb-4 overflow-hidden rounded-lg border border-gray-200">
          <div className="relative w-full h-48">
            <Image
              src={preview}
              alt="Uploaded image"
              fill
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleDeleteImage}
            disabled={isDeleting}
            className="absolute top-2 text-red hover:border-red border border-transparent transition-all  right-2 rounded-full bg-white p-1 shadow hover:bg-gray-100 disabled:opacity-50"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <label
            className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${isDragging ? "border-primary bg-gray-100" : "border-gray-300 bg-gray-50"} hover:bg-gray-100`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="mb-3 h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG or GIF (MAX. 4MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isUploading}
            />
          </label>
          {isUploading && (
            <div className="mt-2 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
