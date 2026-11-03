import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy | Etan Heyman",
  description: "Privacy policy for Etan Heyman’s personal Google integration.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4.5 py-8 sm:p-20">
      <h1 className="font-[Nutmeg] text-[34px] font-semibold text-blue-200 md:text-[64px]">Privacy policy</h1>
      <p className="text-sm font-light">Effective and last updated: 4 November 2026.</p>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Scope and operator</h2>
        <p className="text-sm font-light md:text-lg">This policy covers the personal Google integration operated by Etan Heyman, currently named Golems, including use by BrainLayer and his own local tools. It is for Etan’s personal use; it is not a public service.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Google data accessed and used</h2>
        <p className="text-sm font-light md:text-lg">With Etan’s authorization, the tools access Google Drive files and metadata, Google Docs documents, Sheets spreadsheets, Slides presentations, and Calendar events and calendar metadata. Depending on the permissions granted and the task requested, the tools can read, search, create, update, or delete this content and change sharing settings at Etan’s direction to support Etan’s personal organization, retrieval, scheduling, and development workflows.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Storage and protection</h2>
        <p className="text-sm font-light md:text-lg">Authorized content may be downloaded, cached, or indexed in Etan’s local tools. AI-assisted requests may also involve provider processing as described below. OAuth credentials and tokens are kept in private local configuration and are not published with the website or source code. Access is limited to Etan and his authorized tools.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">No sale or advertising</h2>
        <p className="text-sm font-light md:text-lg">Google user data is not sold, rented, or shared with other people for their own purposes, and Etan does not use it for advertising or to train generalized AI or machine learning models. When Etan requests an AI-assisted task, relevant content may be transmitted to the AI model providers he uses, such as OpenAI or Anthropic, to process that request. These transfers serve only Etan’s requested tasks.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Retention, deletion, and revocation</h2>
        <p className="text-sm font-light md:text-lg">Local copies and indexes are retained only while needed for these personal workflows. Etan can delete them and revoke the integration’s access through his Google Account connections settings. Revocation stops future authorized access; existing local copies must be deleted separately. For deletion questions, contact the operator below.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Google API use</h2>
        <p className="text-sm font-light md:text-lg">Use of information received from Google APIs adheres to the Google API Services User Data Policy, including its Limited Use requirements.</p>
      </section>
      <p><a className="text-blue-200 underline" href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a></p>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-blue-200">Contact</h2>
        <p>Etan Heyman: <a className="text-blue-200 underline" href="mailto:etan@heyman.net">etan@heyman.net</a></p>
      </section>
      <Link className="text-blue-200 underline" href="/terms">Terms of service</Link>
    </main>
  );
}
