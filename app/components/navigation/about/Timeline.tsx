'use client';

import {useEffect, useRef} from 'react';
import TimelineItem from './TimelineItem';
// Remove or create the missing TimelineParallaxArrow component
import TimelineParallaxArrow from './TimelineParallaxArrow';

const Timeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelinePositionRef = useRef<number>(0);

  useEffect(() => {
    const calculatePosition = () => {
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        timelinePositionRef.current = window.scrollY + rect.top;
      }
    };

    // Calculate position on mount and window resize
    calculatePosition();
    window.addEventListener('resize', calculatePosition);

    // Recalculate after a short delay to ensure all elements are properly rendered
    const timer = setTimeout(calculatePosition, 300);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={timelineRef} className='relative py-8'>
      <TimelineParallaxArrow timelineRef={timelineRef as React.RefObject<HTMLDivElement>} />

      <div className='flex flex-col gap-8'>
        <TimelineItem period='2013-2016' title='Art major, Ironi Alef school of Arts and Design, Rabin, Israel' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem period='2016-2019' title='IDF service' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem period='2019-2021' title='Service industry' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem period='2021-2022' title='Logistic manager, Full-Stack student' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem period='2022-2023' title='JamsNext internship' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem period='2023-TODAY' title='Freelance Full-stack developer' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />
      </div>
    </div>
  );
};

export default Timeline;
