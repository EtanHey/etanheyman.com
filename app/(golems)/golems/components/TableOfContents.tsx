'use client';

import { useState, useEffect } from 'react';

type TocItem = { id: string; text: string; level: number };

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Read actual heading IDs from the DOM (set by rehype-slug)
    const article = document.querySelector('article');
    if (!article) return;

    const els = article.querySelectorAll('h2, h3, h4');
    const items: TocItem[] = [];
    for (const el of els) {
      if (el.id && el.textContent) {
        items.push({
          id: el.id,
          text: el.textContent.trim(),
          level: parseInt(el.tagName[1]),
        });
      }
    }
    setHeadings(items);

    // Scroll to hash on load
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }

    // IntersectionObserver for active heading tracking
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

    for (const el of els) {
      if (el.id) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  if (headings.length < 3) return null;

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
                  setActiveId(h.id);
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
