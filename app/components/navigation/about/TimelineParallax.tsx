'use client';

import {useEffect, useRef, useState} from 'react';
import SendRightPointer from './send-right-pointer';
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
  const [activeIndex, setActiveIndex] = useState(0);
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
      const end = lastItem.bottom + window.scrollY;

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
        const items = timelineRef.current.querySelectorAll('[data-timeline-index]');

        // Calculate how far we've scrolled through the timeline (as a percentage)
        // Add a small buffer to start the progress a bit earlier and end a bit later
        // This makes the arrow and line reach their start/end positions more naturally
        const scrollBuffer = 50; // pixels to buffer at start and end
        const adjustedStart = timelineStart - scrollBuffer - 30; // Pushed up by 10px more (from -20 to -30)
        const adjustedEnd = timelineEnd + scrollBuffer - 40; // Keep the bottom end the same
        const adjustedHeight = adjustedEnd - adjustedStart;

        let scrollProgress = (scrollY - adjustedStart + viewportHeight / 2) / adjustedHeight;
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));

        // Calculate new arrow position based on scroll progress
        // Add vertical offset to make arrow start and end a bit lower
        const arrowStartOffset = 20 - 20; // Start offset in pixels, pushed up by 20px
        const arrowEndOffset = 30 + 20; // End offset in pixels, pushed down by 20px
        const totalArrowOffset = arrowStartOffset + (arrowEndOffset - arrowStartOffset) * scrollProgress;
        const arrowY = timelineStart + timelineHeight * scrollProgress + totalArrowOffset;

        // Apply position directly to avoid jumps
        if (arrowRef.current) {
          // Calculate final arrow position relative to viewport
          const arrowOffset = arrowY - scrollY;
          arrowRef.current.style.transform = `translateY(${arrowOffset}px)`;
        }

        // Find the active item based on scroll position
        let newActiveIndex = 0;
        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const itemTop = rect.top + scrollY - 150; // Offset for earlier activation

          if (scrollY >= itemTop) {
            newActiveIndex = index;
          }
        });

        if (activeIndex !== newActiveIndex) {
          setActiveIndex(newActiveIndex);
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
  }, [isInitialized, timelineStart, timelineEnd, activeIndex]);

  return (
    <div ref={timelineRef} className='relative py-8'>
      {/* Fixed Timeline Arrow */}
      <div
        ref={arrowRef}
        className='fixed  left-5 z-50 pointer-events-none'
        style={{
          top: 0,
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.3s ease-in'
        }}>
        <div className='flex -translate-1/2 items-center justify-center w-5 h-5 bg-blue-500 rounded-full shadow-lg'>
          <SendRightPointer />
        </div>
      </div>

      {/* Timeline Items */}
      <div className='flex flex-col gap-8 relative border-l-2 border-blue-500'>
        {/* Timeline items */}
        {timelineData.map((item, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

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
