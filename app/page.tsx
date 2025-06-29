import Link from "next/link";
import Me from "./components/Me";
import { prisma as db } from "@/lib/db";

export default async function Home() {
  // Fetch projects
  const projects = await db.project.findMany({
    take: 5
  });
  return (
    <main className="flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <section className="flex flex-col px-6 pt-12 pb-8">
        <div className="mx-auto w-full max-w-[350px]">
          {/* Profile Image */}
          <div className="mb-6">
            <Me />
          </div>
          
          {/* Name */}
          <h1 className="mb-2 text-2xl font-medium text-white">
            Etan Heyman<span className="text-blue-500 text-3xl">.</span>
          </h1>
          
          {/* Tagline */}
          <p className="mb-8 text-sm text-white/50">
            I'll develop anything,<br />
            anywhere.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex w-full flex-col gap-3">
          <Link href="#projects" className="w-full">
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-blue-600">
              My projects
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </Link>
          <Link href="/Etan_Heyman_resume.pdf" target="_blank" className="w-full">
            <button className="flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-white/10">
              Download my CV
            </button>
          </Link>
        </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="px-6 py-4">
        <div className="mx-auto max-w-[320px] space-y-4">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/projects/${project.id}`}
              className="block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-white bg-gray-800 transition-transform hover:scale-[1.02]">
                {/* Background Image */}
                {project.previewImage ? (
                  <img 
                    src={project.previewImage} 
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-orange-300" />
                )}
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                {/* Framework Tag */}
                <div className="absolute right-3 top-3 z-10">
                  <span className="inline-block rounded bg-yellow-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                    {project.framework || "Web"}
                  </span>
                </div>
                
                {/* Project Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="mb-1 text-base font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Demo projects if database is empty */}
          {projects.length === 0 && (
            <>
              {/* Beili */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-pink-300 to-orange-300 transition-transform hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute right-3 top-3 z-10">
                  <span className="inline-block rounded bg-yellow-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                    Webby
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="mb-1 text-base font-semibold text-white">Beili</h3>
                  <p className="text-xs text-white/70 line-clamp-2">
                    A small description on the project will come here, in two lines only.
                  </p>
                </div>
              </div>
              
              {/* Sharon Fitness */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-blue-300 to-gray-300 transition-transform hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute right-3 top-3 z-10">
                  <span className="inline-block rounded bg-yellow-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                    Webby
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="mb-1 text-base font-semibold text-white">Sharon Fitness</h3>
                  <p className="text-xs text-white/70 line-clamp-2">
                    A small description on the project will come here, in two lines only.
                  </p>
                </div>
              </div>
              
              {/* Ofek Fitness */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-amber-300 to-brown-300 transition-transform hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute right-3 top-3 z-10">
                  <span className="inline-block rounded bg-yellow-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                    Freelance
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="mb-1 text-base font-semibold text-white">Ofek Fitness</h3>
                  <p className="text-xs text-white/70 line-clamp-2">
                    A small description on the project will come here, in two lines only.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-12 text-center">
        <div className="mx-auto max-w-[320px]">
          <h2 className="mb-2 text-2xl font-semibold text-white">
            Like what you see?
          </h2>
          <p className="mb-6 text-sm text-white/50">
            Don't hesitate to contact me<br />
            right away!
          </p>
          <Link href="/contact">
            <button className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-blue-600">
              Let's talk now →
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
