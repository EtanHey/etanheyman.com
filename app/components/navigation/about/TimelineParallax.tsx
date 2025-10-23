"use client";

import { useEffect, useRef, useState } from "react";
import SendRightPointer from "./SendRightPointer";
import TimelineItem from "./TimelineItem";

// Timeline data
const timelineData = [
  {
    period: "2013-2016",
    title: "Art major, Ironi Alef school of Arts and Sciences, Modi'in, Israel",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    period: "2016-2019",
    title: "IDF service",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    period: "2019-2021",
    title: "Service industry",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    period: "2021-2022",
    title: "Logistic manager, Full-Stack student",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    period: "2022-2023",
    title: "JamsNext internship",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    period: "2023-TODAY",
    title: "Freelance Full-stack developer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

const TimelineParallax = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Setup intersection observer for item animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("timeline-item-visible");
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1,
      },
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      itemRefs.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  // Handle scroll
  useEffect(() => {
    let maxProgress = 0;

    const handleScroll = () => {
      if (!timelineRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const timelineTop = timelineRect.top + scrollY;
      const timelineHeight = timelineRect.height;

      // Progress line fills when items enter bottom 25% of screen
      const fillTrigger = scrollY + windowHeight * 0.75;
      let fillProgress = (fillTrigger - timelineTop) / timelineHeight;
      fillProgress = Math.max(0, Math.min(1, fillProgress));

      // Only increase progress, never decrease
      if (fillProgress > maxProgress) {
        maxProgress = fillProgress;
        setScrollProgress(maxProgress);
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleY(${maxProgress})`;
        }
      }

      // Arrow tracks viewport center through timeline
      const viewportCenter = scrollY + windowHeight / 2;
      let arrowProgress = (viewportCenter - timelineTop) / timelineHeight;

      // Keep arrow within bounds (0-100%)
      arrowProgress = Math.max(0, Math.min(1, arrowProgress));

      // Update arrow position
      if (arrowRef.current) {
        arrowRef.current.style.top = `${arrowProgress * 100}%`;
        arrowRef.current.style.opacity =
          arrowProgress > 0 && arrowProgress < 1 ? "1" : "0";
      }

      // Find active item
      let active = -1;
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;

        // Check if arrow is near this item
        if (Math.abs(windowHeight / 2 - itemCenter) < 50) {
          active = index;
        }
      });

      setActiveIndex(active);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .timeline-item-visible {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        [data-timeline-index] {
          opacity: 0;
        }
      `}</style>

      <div ref={timelineRef} className="relative">
        {/* Timeline container */}
        <div className="relative">
          {/* Background line - left side */}
          <div className="absolute top-0 left-0 h-full w-1 bg-blue-200/40" />

          {/* Progress line - left side */}
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full w-1 origin-top bg-blue-500 transition-none"
            style={{
              transform: "scaleY(0)",
            }}
          />

          {/* Arrow - positioned left of the line */}
          <div
            ref={arrowRef}
            className="pointer-events-none absolute left-0 z-999999 transition-all duration-200 ease-out"
            style={{
              top: "0%",
              opacity: 0,
              transform: "translateX(-1rem)",
            }}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 sm:h-9 sm:w-9 ${
                activeIndex !== -1
                  ? "scale-110 bg-blue-600 shadow-xl shadow-blue-600/40"
                  : "bg-blue-500 shadow-lg"
              }`}
            >
              <SendRightPointer />
            </div>
          </div>

          {/* Timeline Items */}
          <div className="flex flex-col gap-8">
            {timelineData.map((item, index) => {
              const isActive = index === activeIndex;
              const isPassed =
                scrollProgress > (index + 0.5) / timelineData.length;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  data-timeline-index={index}
                  className="relative pl-8 sm:pl-10 md:pl-12"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  {/* Timeline dot - on the left line */}
                  <div
                    className={`absolute left-0 h-3 w-3 -translate-x-1/2 rounded-full border-2 transition-all duration-300 sm:h-4 sm:w-4 ${
                      isActive
                        ? "scale-125 border-blue-600 bg-blue-600"
                        : isPassed
                          ? "border-blue-500 bg-blue-500"
                          : "border-blue-300 bg-white"
                    }`}
                    style={{
                      top: "1.25rem",
                    }}
                  />

                  {/* Item content */}
                  <div
                    className={`transition-all duration-300 ${
                      isActive ? "translate-x-1 opacity-100" : "opacity-80"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-blue-400 sm:text-sm">
                        {item.period}
                      </span>
                      <h3
                        className={`mt-1 mb-2 text-base font-semibold transition-colors duration-300 sm:text-lg ${
                          isActive ? "text-blue-600" : "text-white"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs font-light text-gray-300 sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TimelineParallax;
