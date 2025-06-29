"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error("Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-white">Something went wrong!</h2>
        <p className="mb-6 text-gray-300">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}