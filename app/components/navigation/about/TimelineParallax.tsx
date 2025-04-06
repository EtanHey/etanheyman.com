'use client';

import {useEffect, useRef, useState} from 'react';
import SendRightPointer from './SendRightPointer';
import TimelineItem from './TimelineItem';

// Timeline data
const timelineData = [
  {
    period: '2013-2016',
    title: "Art major, Ironi Alef school of Arts and Sciences, Modi'in, Israel",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    period: '2016-2019',
    title: 'IDF service',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    period: '2019-2021',
    title: 'Service industry',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    period: '2021-2022',
    title: 'Logistic manager, Full-Stack student',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    period: '2022-2023',
    title: 'JamsNext internship',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    period: '2023-TODAY',
    title: 'Freelance Full-stack developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  }
];

const TimelineParallax = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [timelineStart, setTimelineStart] = useState(0);
  const [timelineEnd, setTimelineEnd] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate timeline measurements
  useEffect(() => {
    if (!timelineRef.current) return;

    const calculatePositions = () => {
      if (!timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      if (!timelineRect) return;

      const items = timelineRef.current.querySelectorAll('[data-timeline-index]');
      if (items.length === 0) return;

      const firstItem = items[0].getBoundingClientRect();
      const lastItem = items[items.length - 1].getBoundingClientRect();

      const start = firstItem.top + window.scrollY;
      // Apply the 100px reduction only on mobile screens (up to 640px width)
      const mobileOffset = window.innerWidth < 640 ? 100 : 0;
      const end = lastItem.bottom + window.scrollY - mobileOffset;

      setTimelineStart(start);
      setTimelineEnd(end);
      setIsInitialized(true);

      // Position arrow at initial position (at the top with our offset)
      if (arrowRef.current) {
        arrowRef.current.style.transform = `translateY(${firstItem.top}px)`;
        arrowRef.current.style.opacity = '1';
      }
    };

    // Calculate on mount and window resize
    calculatePositions();

    // Recalculate on resize
    const handleResize = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      calculatePositions();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Handle scroll to update arrow position and active item
  useEffect(() => {
    if (!isInitialized) return;

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!timelineRef.current || timelineStart === 0 || timelineEnd === 0) return;

        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const timelineHeight = timelineEnd - timelineStart;

        // Calculate how far we've scrolled through the timeline (as a percentage)
        // Add a small buffer to start the progress a bit earlier and end a bit later
        // This makes the arrow and line reach their start/end positions more naturally
        const scrollBuffer = 50; // pixels to buffer at start and end
        const adjustedStart = timelineStart - scrollBuffer - 30; // Pushed up by 10px more (from -20 to -30)

        // Add responsive adjustment for desktop
        const desktopAdjustment = window.innerWidth >= 768 ? 300 : 0; // Increased from 100px to 300px for more noticeable change
        const adjustedEnd = timelineEnd + scrollBuffer - 40 - desktopAdjustment; // Move endpoint up on desktop

        const adjustedHeight = adjustedEnd - adjustedStart;

        let scrollProgress = (scrollY - adjustedStart + viewportHeight / 2) / adjustedHeight;
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));

        // Calculate new arrow position based on scroll progress
        // Add vertical offset to make arrow start and end a bit lower
        const arrowStartOffset = 20 - 20; // Start offset in pixels, pushed up by 20px

        // Make arrowEndOffset responsive - 30 for mobile/tablet (767px and below), 50 for desktop
        const arrowEndOffset = window.innerWidth <= 767 ? 30 + 20 : 20; // End offset in pixels

        const totalArrowOffset = arrowStartOffset + (arrowEndOffset - arrowStartOffset) * scrollProgress;

        // Calculate base arrow position
        let arrowY = timelineStart + timelineHeight * scrollProgress + totalArrowOffset;

        // Apply desktop-specific endpoint adjustment that directly affects the final position
        // This creates a more pronounced effect by capping the endpoint on desktop
        if (window.innerWidth >= 640 && scrollProgress > 0.85) {
          // Once we're past 85% of the timeline on desktop, start moving toward the final position more quickly
          // This effectively caps the endpoint lower on the screen
          const cappedProgress = 0.85 + (scrollProgress - 0.85) * 0.5; // Slow down the last 15% of movement
          arrowY = timelineStart + timelineHeight * cappedProgress + totalArrowOffset;
        }

        // Apply position directly to avoid jumps
        if (arrowRef.current) {
          // Calculate final arrow position relative to viewport
          const arrowOffset = arrowY - scrollY;
          arrowRef.current.style.transform = `translateY(${arrowOffset}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    // Initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isInitialized, timelineStart, timelineEnd]);

  return (
    <div ref={timelineRef} className='relative'>
      {/* Fixed Timeline Arrow */}
      <div ref={arrowRef} className='fixed left-5 sm:left-20 z-50 pointer-events-none opacity-0 top-0 transition-opacity duration-300 ease-in will-change-transform'>
        <div className='flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2'>
          <SendRightPointer />
        </div>
      </div>

      {/* Timeline Items */}
      <div className='flex flex-col gap-8 relative border-l-4 border-blue-500'>
        {/* Timeline items */}
        {timelineData.map((item, index) => {
          return (
            <div key={index} data-timeline-index={index} className='relative pl-4'>
              {/* Item content */}
              <TimelineItem index={index} period={item.period} title={item.title} description={item.description} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineParallax;
