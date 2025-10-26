"use client";

import { motion, useScroll, useTransform, useSpring, useInView, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import SendRightPointer from "./SendRightPointer";

// Timeline data - ordered from newest to oldest
const timelineData = [
  {
    period: "08/2024-TODAY",
    title: "Software Engineer • Cantaloupe AI - New Orleans, LA/Denver, CO",
    description:
      "Front-end focused full-stack developer building Cantaloupe AI's recruitment platform from the ground up: React Native → Svelte → Bubble.io → Svelte → Next.js. Joined when it was just an early mockup, helped create the MVP and progressed to create a working platform that connects hospitality and construction candidates with employers through AI-powered interviews. Implemented Vapi.ai integration for automated candidate screening (reducing manual work by 80%), designed database schemas, built real-time features, created responsive dashboards, and integrated third-party services including Merge.dev ATS/HRIS systems, Google Maps APIs, Twilio messaging, and a bilingual Spanish/English front end using i18n.",
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

// Timeline Item Component
function TimelineItem({
  item,
  index,
  isPast
}: {
  item: typeof timelineData[0];
  index: number;
  isPast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "-45% 0px -45% 0px", // Centered viewport detection
    amount: 0.3,
  });

  // Determine dot state: active (in view), past (arrow passed), or future
  const isActive = isInView && !isPast;
  const isFilled = isActive || isPast;

  return (
    <div
      ref={ref}
      className="relative pl-8 sm:pl-10 md:pl-12"
    >
      {/* Timeline dot */}
      <motion.div
        className={`absolute h-3 w-3 rounded-full border-2 transition-all duration-300 sm:h-4 sm:w-4`}
        animate={{
          scale: isActive ? 1.25 : 1,
          borderColor: isFilled ? "#0F82EB" : "#9ca3af",
          backgroundColor: isFilled ? "#0F82EB" : "#ffffff",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        style={{
          top: "1.25rem",
          left: "2px", // Half of line width (4px / 2) to center on line
          x: "-50%", // Center the dot using Framer Motion's x
        }}
      />

      {/* Item content */}
      <motion.div
        className={`transition-all duration-300`}
        animate={{
          x: isActive ? 4 : 0,
          opacity: isActive ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
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
      </motion.div>
    </div>
  );
}

const TimelineParallax = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for the timeline section
  // Using "center center" makes it track when timeline is in middle of viewport
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  // Smooth the progress for better visual effect
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map scroll progress to arrow position - use percentage directly
  const arrowTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Arrow opacity - visible throughout most of the timeline
  const arrowOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0]
  );

  // Track current progress to determine which items are "past"
  const [currentPastIndex, setCurrentPastIndex] = useState(0);

  // Update past index as user scrolls
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const pastIndex = Math.floor(latest * timelineData.length);
    setCurrentPastIndex(pastIndex);
  });

  return (
    <div ref={timelineRef} className="relative">
      {/* Timeline container */}
      <div className="relative">
        {/* Background line - left side */}
        <div className="absolute top-0 left-0 h-full w-1 bg-blue-200/40" />

        {/* Progress line - left side (GPU accelerated with Framer Motion) */}
        <motion.div
          ref={progressRef}
          className="absolute top-0 left-0 h-full w-1 origin-top bg-blue-500"
          style={{
            scaleY: smoothProgress,
          }}
        />

        {/* Arrow - positioned left of the line (GPU accelerated) */}
        <motion.div
          ref={arrowRef}
          className="pointer-events-none absolute left-0 z-999999"
          style={{
            top: arrowTop,
            opacity: arrowOpacity,
            x: "-1rem",
            y: "-1rem", // Center the arrow vertically
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg sm:h-9 sm:w-9">
            <SendRightPointer />
          </div>
        </motion.div>

        {/* Timeline Items */}
        <div className="flex flex-col gap-8">
          {timelineData.map((item, index) => (
            <TimelineItem
              key={index}
              item={item}
              index={index}
              isPast={index < currentPastIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineParallax;
