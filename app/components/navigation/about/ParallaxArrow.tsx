'use client';

import {useEffect, useRef, useState} from 'react';
import SendRightPointer from './send-right-pointer';

interface ParallaxArrowProps {
  startPosition: number; // The Y position where the career section starts
}

const ParallaxArrow = ({startPosition}: ParallaxArrowProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [arrowPosition, setArrowPosition] = useState(220);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Define fixed positions for timeline items
  const timelinePositions = [
    {y: 220}, // 2013-2016
    {y: 390}, // 2016-2019
    {y: 560}, // 2019-2021
    {y: 730}, // 2021-2022
    {y: 900}, // 2022-2023
    {y: 1070} // 2023-TODAY
  ];

  // Update arrow position based on scroll position
  const updateArrowPosition = () => {
    const currentScrollY = window.scrollY;
    lastScrollY.current = currentScrollY;

    // Show arrow when approaching the career section (100px before)
    const isNearCareerSection = currentScrollY >= startPosition - 100;

    // Hide arrow when scrolled past the career section (1500px after start)
    const isPastCareerSection = currentScrollY > startPosition + 1500;

    setIsVisible(isNearCareerSection && !isPastCareerSection);

    if (isNearCareerSection && !isPastCareerSection) {
      // Calculate which timeline item is currently in view
      const scrollOffset = currentScrollY - startPosition;

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
    // Don't proceed if startPosition is invalid
    if (startPosition <= 0) {
      return;
    }

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
  }, [startPosition]);

  const handleClick = () => {
    // Scroll to the career section
    window.scrollTo({
      top: startPosition - 50,
      behavior: 'smooth'
    });
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
      title='Scroll to career section'>
      <div className='transform scale-150'>
        <SendRightPointer />
      </div>
    </div>
  );
};

export default ParallaxArrow;
