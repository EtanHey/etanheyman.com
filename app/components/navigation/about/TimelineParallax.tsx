"use client";

import { useEffect, useRef, useState } from "react";
import SendRightPointer from "./SendRightPointer";
import TimelineItem from "./TimelineItem";

// Timeline data - ordered from newest to oldest
const timelineData = [
  {
    period: "08/2024-TODAY",
    title: "Software Engineer • Cantaloupe AI - New Orleans, LA/Denver, CO",
    description:
      "Front-end focused full-stack developer building Cantaloupe AI's hiring platform from the ground up, working across React Native, Svelte, Bubble.io and Next.js. Joined when it was just an early mockup, helped create the MVP and progressed to create a working platform that connects hospitality and construction candidates with employers through AI-powered interviews. Implemented Vapi.ai integration for automated candidate screening (reducing manual work by 80%), designed database schemas, built real-time features, created responsive dashboards, and integrated third-party services including Merge.dev ATS/HRIS systems, Google Maps APIs, Twilio messaging, and a bilingual Spanish/English front end using i18n.",
  },
  {
    period: "11/2023-08/2024",
    title: "Full Stack Developer & Project Lead • Weby - Remote (Israel)",
    description:
      "Developed as a front-end developer in a team, full-stack developer independently, and team leader for a group of developers at a company founded by INT College graduates. Built projects using Next.js, Tailwind CSS, Cloudinary, and Mongoose. Key projects: CMS system for a photographer using Cloudinary according to Figma designs, two personal trainer landing pages (one with idle timer prompts), and an online candle store with WhatsApp bot integration for organized orders.",
  },
  {
    period: "07/2023-11/2023",
    title: "Sales Associate • LensCrafters - New Orleans, LA",
    description:
      "Ensured exceptional customer experience for vision needs while continuing freelance development work. Utilized optical prescriptions to recommend lenses and coatings, assisted in frame selection, and conducted measurements using optical tools.",
  },
  {
    period: "12/2022-06/2023",
    title: "Front End Developer • JAMSNext - Remote (California)",
    description:
      "Worked as part of a team of 3 junior developers building a job tracking application to bridge the gap between applicants and recruiters. Developed the job tracker, a drag-and-drop board for applicants and recruiters to track job applications and candidates, using Next.js, Redux, dnd-kit, and .NET lambda for the backend.",
  },
  {
    period: "08/2022-10/2022",
    title: "Full Stack Developer Internship • A.D Knight - Remote",
    description:
      "Developed a map platform for technicians and executives to find distances between points, locate businesses, and convert coordinates. Built with Vite, React.js, Redux Thunk, Leaflet map library, and Google Places & Distance Matrix APIs for a startup focused on pedestrian safety and traffic management applications.",
  },
  {
    period: "10/2021-10/2022",
    title: "Full Stack Developer Training • INT College - Tel-Aviv, Israel",
    description:
      "Completed comprehensive full-stack development training at Israel's leading online institute for high-tech professional training. Learned to build full-stack applications with HTML5, CSS, TypeScript, React.js, Node.js, MongoDB, MySQL, REST APIs, Cloudinary, and Socket.io. Capstone project: Collaborated in a 20-student team with UX/UI designers to build a web application for Gold Ventures Investment firm connecting entrepreneurs with mentors and investors.",
  },
  {
    period: "2019-2021",
    title: "Service Industry - Israel/New Orleans, LA",
    description:
      "Worked in customer-facing roles, building strong communication skills and learning to work effectively in fast-paced team environments while developing an interest in technology.",
  },
  {
    period: "2016-2019",
    title: "IDF Service - Israel",
    description:
      "Completed mandatory military service in the Israel Defense Forces, developing discipline, teamwork, and problem-solving skills in high-pressure environments.",
  },
  {
    period: "2013-2016",
    title: "Art Major • Ironi Alef School of Arts and Sciences - Modi'in, Israel",
    description:
      "Studied visual arts and creative design, developing a strong foundation in aesthetics and visual communication that would later inform my approach to frontend development and UI/UX work.",
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
