import Link from "next/link";

export const CONTACT_EMAIL = "etan@heyman.net";

export default function ContactBand({
  heading = "Tell me what you're building.",
}: {
  heading?: string;
}) {
  return (
    <section className="pf-band" aria-labelledby="contact-band-heading">
      <div className="pf-container grid gap-8 py-16 md:grid-cols-[1.3fr_1fr] md:items-end md:py-24">
        <div>
          <h2 id="contact-band-heading" className="pf-h1 text-white">
            {heading}
          </h2>
          <p className="pf-lede mt-5">
            Hiring for agent tooling, planning a collaboration, or checking my work for a
            role? Send a note through the form or by email.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <Link href="/contact" className="pf-btn pf-btn-ink">
            Write to me
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="pf-btn pf-btn-light">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
