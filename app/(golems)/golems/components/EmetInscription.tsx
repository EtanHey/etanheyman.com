"use client";

import { useState } from "react";

// AIDEV-NOTE: The hero's one interactive moment. In the golem story the word
// emet (אמת, "truth") animates the clay; erase the aleph and it reads met (מת,
// "dead"). The site uses it as its honesty principle for eval evidence. The
// aleph is clipped away (CSS in globals.css) so the word never reflows; with
// reduced motion it fades instead.
export default function EmetInscription() {
  const [erased, setErased] = useState(false);

  return (
    <figure
      data-erased={erased}
      className="g-on-kiln relative flex flex-col justify-between overflow-hidden rounded-2xl bg-g-kiln p-6 text-g-kiln-text ring-1 ring-black/10 ring-inset md:p-8"
    >
      <div
        className="flex min-h-[9rem] items-center justify-center md:min-h-[13rem]"
        aria-hidden="true"
      >
        <span
          dir="rtl"
          lang="he"
          className="font-g-hebrew text-[6.5rem] leading-none tracking-[0.02em] select-none md:text-[10rem]"
        >
          <span className="g-aleph text-g-glaze">א</span>
          <span>מת</span>
        </span>
      </div>

      <figcaption className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="g-emet-gloss max-w-[30ch] text-[0.95rem] leading-relaxed text-g-kiln-muted" aria-live="polite">
          {erased ? (
            <>
              <span className="text-g-kiln-text">Met: dead.</span> Remove the
              first letter and the clay stops. A skill whose claims are not true
              is the same.
            </>
          ) : (
            <>
              <span className="text-g-kiln-text">Emet: truth.</span> In the
              story, this word on its forehead is what brings a golem to life.
            </>
          )}
        </p>
        <button
          type="button"
          aria-pressed={erased}
          onClick={() => setErased((v) => !v)}
          className="g-press shrink-0 self-start rounded-md border border-white/25 px-3.5 py-2 text-sm text-g-kiln-text hover:border-white/50 hover:bg-white/5 sm:self-auto"
        >
          {erased ? "Restore the aleph" : "Erase the aleph"}
        </button>
      </figcaption>
    </figure>
  );
}
