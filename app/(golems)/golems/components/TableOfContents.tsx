'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type TocItem = { id: string; text: string; level: number };

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const isHovering = useRef(false);

  // Auto-scroll the TOC to keep active item visible (unless user is browsing the TOC)
  const scrollTocToActive = useCallback((id: string) => {
    if (isHovering.current || !navRef.current) return;
    const activeLink = navRef.current.querySelector(`a[href="#${CSS.escape(id)}"]`);
    if (activeLink) {
      activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const els = article.querySelectorAll('h2, h3');
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

    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveId(id);
            scrollTocToActive(id);
            // Update URL hash so reload/share preserves position (replaceState avoids history spam)
            history.replaceState(null, '', `#${id}`);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    for (const el of els) {
      if (el.id) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [scrollTocToActive]);

  if (headings.length < 3) return null;

  return (
    <nav
      ref={navRef}
      onMouseEnter={() => { isHovering.current = true; }}
      onMouseLeave={() => { isHovering.current = false; }}
      className="hidden xl:block w-56 shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none"
    >
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
