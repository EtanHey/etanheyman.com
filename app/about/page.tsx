"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import LaptopIcon from "../components/navigation/about/LaptopIcon";
import LocationIcon from "../components/navigation/about/LocationIcon";
import SendIcon from "../components/navigation/about/sendIcon";
import TimelineParallax from "../components/navigation/about/TimelineParallax";
import {
  techIconMap,
  TechIconName,
  TechIconWrapper,
} from "../components/tech-icons/TechIconWrapper";

const AboutPage = () => {
  const careerSectionRef = useRef<HTMLDivElement>(null);
  const [careerSectionPosition, setCareerSectionPosition] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const positionCalculatedRef = useRef(false);

  // Calculate the position only once after initial render
  const calculateInitialPosition = useCallback(() => {
    if (careerSectionRef.current && !positionCalculatedRef.current) {
      const rect = careerSectionRef.current.getBoundingClientRect();
      // Add a small offset to ensure the position is accurate
      const position = Math.round(window.scrollY + rect.top);
      setCareerSectionPosition(position);
      setIsInitialized(true);
      positionCalculatedRef.current = true;
    }
  }, []);

  useEffect(() => {
    // Calculate position on initial render
    calculateInitialPosition();

    // Recalculate on window resize
    window.addEventListener("resize", calculateInitialPosition);

    // Cleanup
    return () => {
      window.removeEventListener("resize", calculateInitialPosition);
    };
  }, [calculateInitialPosition]);

  // Debug log for career section position
  useEffect(() => {
    if (isInitialized) {
      console.log(`Career section position: ${careerSectionPosition}px`);
    }
  }, [isInitialized, careerSectionPosition]);

  return (
    <div className="z-20 flex min-h-screen w-full flex-col items-start justify-items-center gap-20 px-4.5 py-8 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <div className="flex w-full place-content-between gap-20 max-xl:flex-col sm:items-center 2xl:place-content-around">
        <div className="flex max-w-[654px] flex-col gap-4">
          <h1 className="pb-2 text-[34px] leading-5.5 font-bold xl:pb-4 xl:text-[64px] xl:leading-16 xl:text-nowrap">
            Etan Heyman
          </h1>
          <div className="flex items-center gap-4">
            <LaptopIcon />
            <h3 className="text-2xl font-light xl:text-[32px]">
              Full Stack Engineer
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <LocationIcon />
            <h3 className="text-2xl font-light xl:text-[32px]">Denver, CO</h3>
          </div>
          <p className="text-sm font-light xl:text-xl">
            Highly motivated front-end developer with a strong work ethic and a
            proven ability to quickly learn new technologies. Experienced in
            developing dynamic web applications using Next.js and Tailwind CSS,
            as well as React.js with plain CSS and Node.js backend. Adept at
            leading teams and managing projects to successful completion.
          </p>
          <Link
            download="Etan Heyman resume.pdf"
            href="/Etan_Heyman_resume.pdf"
            target="_blank"
            className="w-full rounded-[80px] bg-blue-500 py-4 text-center text-xl text-white xl:mt-4 xl:text-2xl"
          >
            Download My CV
          </Link>
        </div>

        {/* Tech Icons Section */}
        <div className="relative -left-7 flex h-fit max-w-max rotate-[10deg] items-center justify-center max-xl:w-screen xl:-mr-24 xl:min-w-[756px]">
          <div className="grid grid-cols-6 gap-[23.45px] xl:gap-11">
            {Object.keys(techIconMap).map((techName) => (
              <TechIconWrapper key={techName} name={techName as TechIconName} />
            ))}
          </div>
        </div>
      </div>

      {/* Career Journey Section */}
      <div
        ref={careerSectionRef}
        className="flex w-full flex-col gap-2 pt-4"
        id="career-section"
      >
        <h2 className="text-2xl font-bold text-blue-200">My career journey</h2>
        <TimelineParallax />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-6 pb-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-blue-200">
            Like what you see?
          </h2>
          <p className="pr-5 text-[22px] leading-5.5 font-light">
            Don’t hesitate to contact me right away!
          </p>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-[80px] bg-blue-500 py-4 text-xl text-white">
          Let's talk now! <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
