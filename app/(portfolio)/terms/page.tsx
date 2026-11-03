import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of service | Etan Heyman",
  description: "Terms of service for Etan Heyman’s personal Google integration.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4.5 py-8 sm:p-20">
      <h1 className="font-[Nutmeg] text-[34px] font-semibold text-blue-200 md:text-[64px]">Terms of service</h1>
      <p className="text-sm font-light">Effective and last updated: 4 November 2026.</p>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Personal use only</h2>
        <p className="text-sm font-light md:text-lg">This Google integration is operated by Etan Heyman, currently under the name Golems, for use by BrainLayer and his own local tools. It is intended solely for Etan’s personal use and is not offered as a public service or an invitation for others to connect their accounts.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Authorized tasks</h2>
        <p className="text-sm font-light md:text-lg">The integration uses authorized Google Drive files, Docs, Sheets, Slides, and Calendar data for Etan’s personal organization, retrieval, scheduling, and development tasks. Access is limited to the Google permissions granted and may include reading, searching, creating, updating, or deleting content and changing sharing settings at Etan’s direction.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Responsibility and availability</h2>
        <p className="text-sm font-light md:text-lg">Etan is responsible for authorizing tasks, reviewing changes, and keeping backups of important content. These personal tools are provided as available, without a guarantee of uninterrupted availability, accuracy, or fitness for a particular purpose.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Google and third-party services</h2>
        <p className="text-sm font-light md:text-lg">Google services remain subject to Google’s own terms and policies. This integration is independently operated by Etan Heyman and is not endorsed by Google.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Stopping use and changes</h2>
        <p className="text-sm font-light md:text-lg">Etan may stop using the integration at any time and revoke its access in Google Account connections settings. These terms may be updated as the personal tools change; the date above identifies the current version. Data handling is described in the privacy policy.</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Contact</h2>
        <p>Etan Heyman: <a className="text-blue-200 underline" href="mailto:etan@heyman.net">etan@heyman.net</a></p>
      </section>
      <Link className="text-blue-200 underline" href="/privacy">Privacy policy</Link>
    </main>
  );
}
