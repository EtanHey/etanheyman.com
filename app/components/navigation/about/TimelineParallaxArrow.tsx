'use client';

import {RefObject, useEffect, useRef, useState} from 'react';
import SendRightPointer from './send-right-pointer';

interface TimelineParallaxArrowProps {
  timelineRef: RefObject<HTMLDivElement>;
}

const TimelineParallaxArrow = ({timelineRef}: TimelineParallaxArrowProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [arrowPosition, setArrowPosition] = useState(220);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const timelinePositionRef = useRef(0);

  // Define fixed positions for timeline items
  const timelinePositions = [
    {y: 220}, // 2013-2016
    {y: 390}, // 2016-2019
    {y: 560}, // 2019-2021
    {y: 730}, // 2021-2022
    {y: 900}, // 2022-2023
    {y: 1070} // 2023-TODAY
  ];

  useEffect(() => {
    // Calculate the timeline position
    const calculateTimelinePosition = () => {
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        timelinePositionRef.current = window.scrollY + rect.top;
      }
    };

    // Calculate on mount
    calculateTimelinePosition();

    // Recalculate after a short delay to ensure all elements are properly rendered
    const timer = setTimeout(calculateTimelinePosition, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [timelineRef]);

  // Update arrow position based on scroll position
  const updateArrowPosition = () => {
    const currentScrollY = window.scrollY;
    lastScrollY.current = currentScrollY;
    const timelinePosition = timelinePositionRef.current;

    // Show arrow when approaching the timeline section (100px before)
    const isNearTimelineSection = currentScrollY >= timelinePosition - 100;

    // Hide arrow when scrolled past the timeline section (1500px after start)
    const isPastTimelineSection = currentScrollY > timelinePosition + 1500;

    setIsVisible(isNearTimelineSection && !isPastTimelineSection);

    if (isNearTimelineSection && !isPastTimelineSection) {
      // Calculate which timeline item is currently in view
      const scrollOffset = currentScrollY - timelinePosition;

      // Find the appropriate timeline position based on scroll offset
      let newPosition;

      if (scrollOffset < 0) {
        // Before first item
        newPosition = timelinePositions[0].y;
      } else if (scrollOffset < 200) {
        // First item (2013-2016)
        newPosition = timelinePositions[0].y;
      } else if (scrollOffset < 400) {
        // Second item (2016-2019)
        newPosition = timelinePositions[1].y;
      } else if (scrollOffset < 600) {
        // Third item (2019-2021)
        newPosition = timelinePositions[2].y;
      } else if (scrollOffset < 800) {
        // Fourth item (2021-2022)
        newPosition = timelinePositions[3].y;
      } else if (scrollOffset < 1000) {
        // Fifth item (2022-2023)
        newPosition = timelinePositions[4].y;
      } else {
        // Last item (2023-TODAY)
        newPosition = timelinePositions[5].y;
      }

      setArrowPosition(newPosition);
    }

    ticking.current = false;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        // Use requestAnimationFrame to optimize performance
        rafRef.current = window.requestAnimationFrame(() => {
          updateArrowPosition();
        });
        ticking.current = true;
      }
    };

    // Add scroll event listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, {passive: true});

    // Initial check
    updateArrowPosition();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    // Scroll to the timeline section
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const targetPosition = window.scrollY + rect.top - 50;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      onClick={handleClick}
      className='fixed left-8 z-50 flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-300'
      style={{
        top: `${arrowPosition}px`,
        transform: 'translateZ(0)', // Force hardware acceleration
        willChange: 'top', // Hint to browser for optimization
        transition: 'top 0.3s ease-out'
      }}
      title='Scroll to timeline section'>
      <div className='transform scale-150'>
        <SendRightPointer />
      </div>
    </div>
  );
};

export default TimelineParallaxArrow;
