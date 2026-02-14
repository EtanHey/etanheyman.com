"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useRef, useState } from "react";
import SendRightPointer from "./SendRightPointer";

// --- Brand color constants (single source of truth) ---
const BRAND_BLUE = "#0F82EB";
const BRAND_BLUE_RGB = "15, 130, 235";
const BRAND_DARK = "#0053A4";
const BRAND_LIGHT = "#3B9FFF";

// Timeline data - ordered from newest to oldest
const timelineData = [
  {
    period: "08/2024-TODAY",
    title: "Software Engineer • Cantaloupe AI - New Orleans, LA/Denver, CO",
    description:
      "Building recruitment platform from the ground up. Tech stack: React Native → Svelte → Bubble.io → Svelte → Next.js. Implemented Vapi.ai integration for automated candidate screening (reducing manual work by 80%), designed database schemas, built real-time features, created responsive dashboards, and integrated third-party services including Merge.dev ATS/HRIS systems, Google Maps APIs, Twilio messaging, and bilingual i18n support.",
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

// --- Dot with animated ripple rings ---
function DotWithRipple({
  isActive,
  isPast,
  reducedMotion,
  isVisible,
}: {
  isActive: boolean;
  isPast: boolean;
  reducedMotion: boolean;
  isVisible: boolean;
}) {
  const isFilled = isActive || isPast;

  return (
    <motion.div
      className="absolute"
      style={{ top: "1.75rem", left: "1.5px", transform: "translateX(-50%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sonar ripple rings — only on active dot */}
      {isActive && !reducedMotion && (
        <>
          {[0, 1].map((i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute rounded-full border border-blue-400/30"
              style={{
                top: "50%",
                left: "50%",
                x: "-50%",
                y: "-50%",
              }}
              initial={{ width: 14, height: 14, opacity: 0.6 }}
              animate={{ width: 50, height: 50, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: i * 0.4,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* The dot itself */}
      <motion.div
        className="rounded-full border-2"
        animate={{
          scale: isActive ? 1.5 : 1,
          borderColor: isFilled ? BRAND_BLUE : "#4B5563",
          backgroundColor: isFilled ? BRAND_BLUE : "transparent",
          boxShadow: isActive
            ? `0 0 12px rgba(${BRAND_BLUE_RGB}, 0.6), 0 0 24px rgba(${BRAND_BLUE_RGB}, 0.2)`
            : "0 0 0px rgba(0, 0, 0, 0)",
        }}
        transition={
          reducedMotion
            ? { duration: 0.15 }
            : { type: "spring", stiffness: 300, damping: 25 }
        }
        style={{ width: 14, height: 14 }}
      />
    </motion.div>
  );
}

// --- Individual timeline card with 3D entrance + glassmorphism ---
function TimelineCard({
  item,
  index,
  isActive,
  isPast,
  itemRef,
  reducedMotion,
}: {
  item: (typeof timelineData)[0];
  index: number;
  isActive: boolean;
  isPast: boolean;
  itemRef: (el: HTMLDivElement | null) => void;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.1 });

  const setRefs = (el: HTMLDivElement | null) => {
    cardRef.current = el;
    itemRef(el);
  };

  return (
    <div
      ref={setRefs}
      className="relative pl-10 sm:pl-12 md:pl-14"
      style={reducedMotion ? undefined : { perspective: 800 }}
    >
      <DotWithRipple
        isActive={isActive}
        isPast={isPast}
        reducedMotion={reducedMotion}
        isVisible={isInView}
      />

      {/* Entrance animation wrapper — 3D unfold on scroll */}
      <motion.div
        initial={
          reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 30, rotateX: 6 }
        }
        animate={
          isInView
            ? reducedMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, rotateX: 0 }
            : undefined
        }
        transition={
          reducedMotion
            ? { duration: 0.3 }
            : {
                type: "spring",
                stiffness: 80,
                damping: 18,
                delay: index * 0.08,
              }
        }
        style={reducedMotion ? undefined : { transformStyle: "preserve-3d" }}
      >
        {/* Glass card — active state gets full treatment */}
        <motion.div
          className="rounded-xl p-4 sm:p-5"
          style={{
            borderWidth: "1px 1px 1px 3px",
            borderStyle: "solid",
          }}
          animate={{
            borderLeftColor: isActive
              ? BRAND_BLUE
              : isPast
                ? `rgba(${BRAND_BLUE_RGB}, 0.12)`
                : "transparent",
            borderTopColor: isActive
              ? `rgba(${BRAND_BLUE_RGB}, 0.15)`
              : "transparent",
            borderRightColor: isActive
              ? `rgba(${BRAND_BLUE_RGB}, 0.15)`
              : "transparent",
            borderBottomColor: isActive
              ? `rgba(${BRAND_BLUE_RGB}, 0.15)`
              : "transparent",
            backgroundColor: isActive
              ? `rgba(${BRAND_BLUE_RGB}, 0.05)`
              : "rgba(0, 0, 0, 0)",
            boxShadow: isActive
              ? `0 8px 32px rgba(${BRAND_BLUE_RGB}, 0.2), 0 0 60px rgba(${BRAND_BLUE_RGB}, 0.05), inset 0 1px 0 rgba(${BRAND_BLUE_RGB}, 0.08)`
              : "0 0 0px rgba(0, 0, 0, 0)",
          }}
          whileHover={
            !isActive && !reducedMotion
              ? {
                  y: -6,
                  backgroundColor: `rgba(${BRAND_BLUE_RGB}, 0.03)`,
                  borderLeftColor: `rgba(${BRAND_BLUE_RGB}, 0.15)`,
                  boxShadow: `0 6px 24px rgba(${BRAND_BLUE_RGB}, 0.12), 0 0 8px rgba(${BRAND_BLUE_RGB}, 0.05)`,
                }
              : undefined
          }
          whileFocus={
            !isActive && !reducedMotion
              ? {
                  y: -6,
                  backgroundColor: `rgba(${BRAND_BLUE_RGB}, 0.03)`,
                  borderLeftColor: `rgba(${BRAND_BLUE_RGB}, 0.15)`,
                  boxShadow: `0 6px 24px rgba(${BRAND_BLUE_RGB}, 0.12), 0 0 8px rgba(${BRAND_BLUE_RGB}, 0.05)`,
                }
              : undefined
          }
          tabIndex={0}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Date badge with accent line */}
          <div className="mb-1 flex items-center gap-2">
            <motion.div
              className="h-[2px] rounded-full bg-blue-500"
              animate={{
                width: isActive ? 24 : 12,
                opacity: isActive ? 1 : 0.4,
              }}
              transition={{ duration: 0.4 }}
            />
            <motion.span
              className="text-xs font-medium tracking-wider text-blue-400 sm:text-sm"
              animate={{ opacity: isActive ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
            >
              {item.period}
            </motion.span>
          </div>

          {/* Title with glow on active */}
          <motion.h3
            className="mb-2 text-base font-semibold sm:text-lg"
            animate={{
              color: isActive ? BRAND_BLUE : "#FFFFFF",
              textShadow: isActive
                ? `0 0 30px rgba(${BRAND_BLUE_RGB}, 0.4)`
                : `0 0 0px rgba(${BRAND_BLUE_RGB}, 0)`,
            }}
            transition={{ duration: 0.4 }}
          >
            {item.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-xs font-light leading-relaxed sm:text-sm"
            animate={{
              color: isActive
                ? "rgba(209, 213, 219, 1)"
                : "rgba(209, 213, 219, 0.6)",
            }}
            transition={{ duration: 0.4 }}
          >
            {item.description}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// --- Main Timeline Component ---
const TimelineParallax = () => {
  const reducedMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  // AIDEV-NOTE: Snap progress — both arrow AND progress line snap to dot positions.
  // Uses useMotionValue (not React state) so useSpring tracks changes reactively.
  // This creates the "gravity well" effect at each dot.
  const snapTarget = useMotionValue(0);
  const snapProgress = useSpring(snapTarget, {
    stiffness: 300,
    damping: 28,
    restDelta: 0.001,
  });

  const arrowTop = useTransform(snapProgress, [0, 1], ["0%", "100%"]);
  const arrowOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0],
  );

  // AIDEV-NOTE: Active-index calculation using getBoundingClientRect()
  // Checks which timeline item the arrow is pointing at on every scroll event.
  // Performance acceptable: Framer Motion optimizes scroll events, only 9 elements.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const timelineHeight = timelineRect.height;
    const arrowPosition = latest * timelineHeight;

    let activeIndex = 0;
    let foundMatch = false;

    for (let i = 0; i < itemRefs.current.length; i++) {
      const itemEl = itemRefs.current[i];
      if (!itemEl) continue;

      const itemRect = itemEl.getBoundingClientRect();
      const timelineTop = timelineRect.top;
      const itemTop = itemRect.top - timelineTop;
      const itemBottom = itemTop + itemRect.height;

      if (arrowPosition >= itemTop && arrowPosition < itemBottom) {
        activeIndex = i;
        foundMatch = true;
        break;
      }

      if (i < itemRefs.current.length - 1) {
        const nextItemEl = itemRefs.current[i + 1];
        if (nextItemEl) {
          const nextItemRect = nextItemEl.getBoundingClientRect();
          const nextItemTop = nextItemRect.top - timelineTop;

          if (arrowPosition >= itemBottom && arrowPosition < nextItemTop) {
            activeIndex = i + 1;
            foundMatch = true;
            break;
          }
        }
      }

      if (i === itemRefs.current.length - 1 && arrowPosition >= itemBottom) {
        activeIndex = i;
        foundMatch = true;
      }
    }

    if (foundMatch) {
      setCurrentActiveIndex(activeIndex);
      // Snap to the dot's ACTUAL position within the inner track container
      const activeEl = itemRefs.current[activeIndex];
      if (activeEl && trackRef.current) {
        const trackRect = trackRef.current.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        const dotY = activeRect.top - trackRect.top + 35; // dot center: 1.75rem + 7px (half of 14px dot)
        snapTarget.set(dotY / trackRect.height);
      }
    }
  });

  return (
    <div ref={timelineRef} className="relative py-4">
      {/* Ambient spotlight — soft glow that follows the active card (hidden on mobile for perf) */}
      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute top-0 -left-20 hidden h-[350px] w-[350px] rounded-full sm:block"
          animate={{
            y: `calc(${(currentActiveIndex / Math.max(timelineData.length - 1, 1)) * 100}% - 50%)`,
          }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
          style={{
            background: `radial-gradient(circle, rgba(${BRAND_BLUE_RGB}, 0.12) 0%, rgba(${BRAND_BLUE_RGB}, 0.04) 40%, transparent 70%)`,
            filter: "blur(60px)",
            willChange: "transform",
          }}
        />
      )}

      <div ref={trackRef} className="relative">
        {/* Background track line */}
        <div className="absolute top-0 left-0 h-full w-[3px] rounded-full bg-blue-200/15" />

        {/* Neon progress line — glowing energy trail */}
        <motion.div
          className="absolute top-0 left-0 h-full w-[3px] origin-top rounded-full"
          style={{
            scaleY: snapProgress,
            willChange: "transform",
            background: `linear-gradient(to bottom, ${BRAND_DARK}, ${BRAND_BLUE}, ${BRAND_LIGHT})`,
            boxShadow: [
              `0 0 5px ${BRAND_BLUE}`,
              `0 0 15px rgba(${BRAND_BLUE_RGB}, 0.5)`,
              `0 0 35px rgba(${BRAND_BLUE_RGB}, 0.25)`,
              `0 0 70px rgba(${BRAND_BLUE_RGB}, 0.1)`,
            ].join(", "),
          }}
        />

        {/* Arrow indicator with pulse rings — snaps to dot positions */}
        <motion.div
          className="pointer-events-none absolute left-0 z-50"
          style={{
            top: arrowTop,
            opacity: arrowOpacity,
            x: "calc(-1.15rem + 2px)",
            y: "-19px",
            willChange: "transform",
          }}
        >
          {/* Pulse ring — outer */}
          {!reducedMotion && (
            <>
              <motion.div
                className="absolute rounded-full border-2 border-blue-400/40"
                style={{
                  top: "50%",
                  left: "50%",
                  width: 38,
                  height: 38,
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              {/* Pulse ring — inner delayed */}
              <motion.div
                className="absolute rounded-full border border-blue-400/20"
                style={{
                  top: "50%",
                  left: "50%",
                  width: 38,
                  height: 38,
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{ scale: [1, 2.8], opacity: [0.3, 0] }}
                transition={{
                  duration: 2,
                  delay: 0.6,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </>
          )}

          {/* Arrow circle with glow */}
          <div
            className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full bg-blue-500"
            style={{
              boxShadow: `0 0 12px rgba(${BRAND_BLUE_RGB}, 0.6), 0 0 30px rgba(${BRAND_BLUE_RGB}, 0.3)`,
            }}
          >
            <SendRightPointer />
          </div>
        </motion.div>

        {/* Timeline cards — semantic ordered list for accessibility */}
        <ol className="flex list-none flex-col gap-6 sm:gap-8">
          {timelineData.map((item, index) => (
            <li key={index}>
              <TimelineCard
                item={item}
                index={index}
                isActive={index === currentActiveIndex}
                isPast={index < currentActiveIndex}
                itemRef={(el) => {
                  itemRefs.current[index] = el;
                }}
                reducedMotion={!!reducedMotion}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default TimelineParallax;
