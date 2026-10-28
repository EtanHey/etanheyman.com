import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility statement | Etan Heyman",
  description:
    "Accessibility work, known limitations and how to report a barrier on Etan Heyman's portfolio.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4.5 py-8 sm:p-20">
      <h1 className="font-[Nutmeg] text-[34px] font-semibold text-blue-200 md:text-[64px]">
        Accessibility statement
      </h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Commitment</h2>
        <p className="text-sm font-light md:text-lg">
          I want this site to be usable by everyone, including people who use
          screen readers, keyboard navigation or zoom.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Standard</h2>
        <p className="text-sm font-light md:text-lg">
          I aim to meet WCAG 2.1 level AA, the basis of Israeli Standard 5568.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">What&apos;s done</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm font-light md:text-lg">
          <li>Semantic headings, with one main heading per portfolio page.</li>
          <li>Visible keyboard focus.</li>
          <li>Layouts checked for horizontal scrolling at desktop and phone widths.</li>
          <li>Text alternatives on images.</li>
          <li>CSS animations respect reduced-motion preferences.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Known limitations</h2>
        <p className="text-sm font-light md:text-lg">
          Decorative animations and terminal showcases are visual demonstrations.
          There has been no formal third-party accessibility audit, and I
          haven&apos;t verified every assistive technology.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Contact</h2>
        <p className="text-sm font-light md:text-lg">
          If something doesn&apos;t work for you, tell me through the{" "}
          <Link href="/contact" className="text-blue-200 underline">
            contact page
          </Link>{" "}
          and I&apos;ll fix it.
        </p>
      </section>

      <p className="text-sm font-light">Last updated: 28 October 2026.</p>
    </main>
  );
}
