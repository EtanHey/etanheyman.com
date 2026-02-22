export default function Loading() {
  return (
    <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-16">
      <div className="animate-pulse space-y-8">
        <div className="h-6 w-32 rounded bg-white/5" />
        <div className="h-10 w-80 rounded bg-white/5" />
        <div className="h-4 w-96 rounded bg-white/[0.03]" />
        <div className="h-4 w-72 rounded bg-white/[0.03]" />
      </div>
    </main>
  );
}