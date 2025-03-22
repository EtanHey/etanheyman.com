'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import LaptopIcon from '../components/navigation/about/LaptopIcon';
import LocationIcon from '../components/navigation/about/LocationIcon';
import Timeline from '../components/navigation/about/Timeline';
import {techIconMap, TechIconName, TechIconWrapper} from '../components/tech-icons/TechIconWrapper';

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
    // Calculate position immediately and after a short delay
    calculateInitialPosition();

    // Try multiple times to ensure we get an accurate position
    const timers = [setTimeout(() => calculateInitialPosition(), 100), setTimeout(() => calculateInitialPosition(), 500), setTimeout(() => calculateInitialPosition(), 1000)];

    // Recalculate on resize
    const handleResize = () => {
      positionCalculatedRef.current = false;
      calculateInitialPosition();
    };

    window.addEventListener('resize', handleResize);

    // Force recalculation on scroll if not initialized
    const handleScroll = () => {
      if (!isInitialized && careerSectionRef.current) {
        calculateInitialPosition();
      }
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [calculateInitialPosition, isInitialized]);

  return (
    <div className='flex w-full flex-col z-20 items-start justify-items-center min-h-screen px-4.5 pt-8 gap-10.5 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
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
      <div className='relative rotate-[10deg] max-w-max -left-7 flex justify-center items-center h-fit w-screen my-12'>
        <div className='grid grid-cols-6 gap-[23.45px]'>
          {Object.keys(techIconMap).map((techName) => (
            <TechIconWrapper key={techName} name={techName as TechIconName} />
          ))}
        </div>
      </div>

      {/* Career Journey Section */}
      <div className='w-full mt-8 border-t-2 border-blue-500 pt-4' id='career-section'>
        <h2 className='text-2xl font-bold mb-6'>My career journey</h2>
        <Timeline />
      </div>
    </div>
  );
};

export default AboutPage;
