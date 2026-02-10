'use client';

import { useState, useEffect } from 'react';

type TocItem = { id: string; text: string; level: number };

export default function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block w-56 shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none">
      <p className="text-xs font-semibold text-[#e59500] uppercase tracking-wider mb-3">On this page</p>
      <ul className="space-y-1 text-sm">
        {headings.map((h, i) => (
          <li key={`${h.id}-${i}`} style={{ paddingLeft: `${(h.level - 2) * 12}px` }}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  history.pushState(null, '', `#${h.id}`);
                }
              }}
              className={`block py-1 transition-colors leading-snug ${
                activeId === h.id
                  ? 'text-[#e59500]'
                  : 'text-[#8b7355] hover:text-[#c0b8a8]'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
