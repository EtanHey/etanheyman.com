"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type TocItem = { id: string; text: string; level: number };

const scrollBehavior = (): ScrollBehavior =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const isHovering = useRef(false);

  // Auto-scroll the TOC to keep active item visible (unless user is browsing the TOC)
  const scrollTocToActive = useCallback((id: string) => {
    if (isHovering.current || !navRef.current) return;
    const activeLink = navRef.current.querySelector(
      `a[href="#${CSS.escape(id)}"]`,
    );
    if (activeLink) {
      activeLink.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
    }
  }, []);

  useEffect(() => {
    const article = document.querySelector("article[data-golems-doc]");
    if (!article) return;

    const els = article.querySelectorAll("h2, h3");
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
        setTimeout(() => target.scrollIntoView({ behavior: scrollBehavior() }), 100);
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
            history.replaceState(null, "", `#${id}`);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
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
      onMouseEnter={() => {
        isHovering.current = true;
      }}
      onMouseLeave={() => {
        isHovering.current = false;
      }}
      aria-label="On this page"
      className="scrollbar-thin sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 overflow-y-auto xl:block"
    >
      <p className="mb-3 font-g-display text-[1rem] text-g-ink">
        On this page
      </p>
      <ul className="space-y-0.5 border-l border-g-rule text-[0.88rem]">
        {headings.map((h, i) => (
          <li
            key={`${h.id}-${i}`}
            style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
            className="-ml-px"
          >
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  el.scrollIntoView({ behavior: scrollBehavior() });
                  el.focus({ preventScroll: true });
                  history.pushState(null, "", `#${h.id}`);
                  setActiveId(h.id);
                }
              }}
              aria-current={activeId === h.id ? "location" : undefined}
              className={`block border-l-2 py-1 pl-3 leading-snug transition-colors duration-150 ${
                activeId === h.id
                  ? "border-g-cobalt text-g-ink"
                  : "border-transparent text-g-ash hover:text-g-ink"
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
