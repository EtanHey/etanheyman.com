export default function Loading() {
  return (
    <main className="relative z-10 min-h-screen overflow-x-hidden">
      {/* Skeleton nav bar matching MiniSiteNav */}
      <div className="sticky top-[88px] z-40 w-full border-b border-white/[0.06] bg-[#00003F]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-3.5 md:px-8">
          <div className="h-3 w-16 rounded bg-white/5" />
          <div className="mx-3 h-4 w-px bg-white/10 md:mx-4" />
          <div className="h-[28px] w-[28px] rounded-lg bg-white/5" />
          <div className="ml-2.5 hidden h-3 w-24 rounded bg-white/5 sm:block" />
          <div className="ml-auto flex gap-4">
            <div className="h-3 w-16 rounded bg-white/[0.03]" />
            <div className="h-3 w-20 rounded bg-white/[0.03]" />
            <div className="h-3 w-14 rounded bg-white/[0.03]" />
            <div className="h-3 w-18 rounded bg-white/[0.03]" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 md:px-8 md:py-16">

        {/* Hero: logo + title + description + badges */}
        <section className="mb-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <div className="h-[100px] w-[100px] flex-shrink-0 rounded-3xl bg-white/5 md:h-[140px] md:w-[140px]" />
            <div className="min-w-0 flex-1 space-y-4">
              <div className="h-10 w-full max-w-[288px] rounded bg-white/5 md:h-14 md:max-w-[384px]" />
              <div className="space-y-2">
                <div className="h-4 w-full max-w-[520px] rounded bg-white/[0.03]" />
                <div className="h-4 w-full max-w-[400px] rounded bg-white/[0.03]" />
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="h-9 w-32 rounded-full bg-white/5" />
                <div className="h-9 w-24 rounded-full bg-white/[0.03]" />
                <div className="h-9 w-20 rounded-full bg-white/[0.03]" />
              </div>
            </div>
          </div>
        </section>

        {/* Terminal showcase */}
        <section className="mb-14">
          <div className="h-[260px] rounded-xl border border-white/[0.06] bg-white/[0.02] sm:h-[340px] md:h-[380px]" />
        </section>

        {/* Stats bar */}
        <section className="mb-14">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
        </section>

        {/* Built with */}
        <section className="mb-14">
          <div className="mb-6 h-3 w-20 rounded bg-white/5" />
          <div className="grid grid-cols-4 gap-5 sm:grid-cols-6 md:grid-cols-8 xl:gap-11">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-white/[0.03]"
              />
            ))}
          </div>
        </section>

        {/* Key features */}
        <section className="mb-14">
          <div className="mb-6 h-3 w-24 rounded bg-white/5" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-14">
          <div className="mb-6 h-3 w-28 rounded bg-white/5" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
        </section>

        {/* Get started */}
        <section className="mb-14">
          <div className="mb-6 h-3 w-24 rounded bg-white/5" />
          <div className="h-48 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
        </section>
      </div>
    </main>
  );
}
