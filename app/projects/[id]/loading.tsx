export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-transparent"></div>
        <p className="text-sm text-blue-200">Loading project...</p>
      </div>
    </div>
  )
}