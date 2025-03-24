'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import LaptopIcon from '../components/navigation/about/LaptopIcon';
import LocationIcon from '../components/navigation/about/LocationIcon';
import TimelineParallax from '../components/navigation/about/TimelineParallax';
import {techIconMap, TechIconName, TechIconWrapper} from '../components/tech-icons/TechIconWrapper';
import SendIcon from '../components/navigation/about/sendIcon';

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
    window.addEventListener('resize', calculateInitialPosition);

    // Cleanup
    return () => {
      window.removeEventListener('resize', calculateInitialPosition);
    };
  }, [calculateInitialPosition]);

  // Debug log for career section position
  useEffect(() => {
    if (isInitialized) {
      console.log(`Career section position: ${careerSectionPosition}px`);
    }
  }, [isInitialized, careerSectionPosition]);

  return (
    <div className='flex w-full flex-col z-20 items-start justify-items-center min-h-screen px-4.5 py-8 gap-12 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-[34px] pb-2 leading-5.5 font-bold'>Etan Heyman</h1>
        <div className='flex items-center gap-4'>
          <LaptopIcon />
          <h3 className='text-2xl font-light'>Full Stack Engineer</h3>
        </div>
        <div className='flex items-center gap-4'>
          <LocationIcon />
          <h3 className='text-2xl font-light'>Denver, CO</h3>
        </div>
        <p className='text-sm font-light'>Highly motivated front-end developer with a strong work ethic and a proven ability to quickly learn new technologies. Experienced in developing dynamic web applications using Next.js and Tailwind CSS, as well as React.js with plain CSS and Node.js backend. Adept at leading teams and managing projects to successful completion.</p>
        <button className='bg-blue-500 text-white w-full py-4 rounded-[80px] text-xl'>Download My CV</button>
      </div>

      {/* Tech Icons Section */}
      <div className='relative rotate-[10deg] max-w-max -left-7 flex justify-center items-center h-fit w-screen'>
        <div className='grid grid-cols-6 gap-[23.45px]'>
          {Object.keys(techIconMap).map((techName) => (
            <TechIconWrapper key={techName} name={techName as TechIconName} />
          ))}
        </div>
      </div>

      {/* Career Journey Section */}
      <div ref={careerSectionRef} className='w-full flex flex-col gap-2 mt-8 pt-4' id='career-section'>
        <h2 className='text-2xl text-blue-200 font-bold'>My career journey</h2>
        <TimelineParallax />
      </div>
      <div className='flex flex-col pb-20 gap-6'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-2xl text-blue-200 font-bold'>Like what you see?</h2>
          <p className='text-[22px] pr-5 leading-5.5 font-light'>Don’t hesitate to contact me right away!</p>
        </div>
        <button className='bg-blue-500 text-white w-full py-4 flex items-center justify-center gap-2 rounded-[80px] text-xl'>
          Let's talk now! <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
