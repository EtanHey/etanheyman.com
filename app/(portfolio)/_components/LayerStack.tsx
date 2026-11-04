import Link from "next/link";
import type { CSSProperties } from "react";

export type Plate = {
  name: string;
  role: string;
  note: string;
  href: string;
};

// AIDEV-NOTE: Visual order is top to bottom; memory sits at the base because the
// other layers recall through it. --i drives the desktop step offset and the
// one-time settle stagger in portfolio.css.
export default function LayerStack({ plates }: { plates: Plate[] }) {
  return (
    <ul className="pf-stack" aria-label="What I build, top layer first">
      {plates.map((plate, i) => (
        <li key={plate.name} className="pf-settle" style={{ "--i": i } as CSSProperties}>
          <Link
            href={plate.href}
            className={`pf-plate ${i === 0 ? "pf-plate-top" : ""}`}
            style={{ "--i": i } as CSSProperties}
          >
            <span className="pf-plate-name">{plate.name}</span>
            <span className="pf-plate-role">{plate.role}</span>
            <span className="pf-plate-note">{plate.note}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
