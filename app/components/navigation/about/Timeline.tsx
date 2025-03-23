'use client';

import {useEffect, useRef, useState} from 'react';
import TimelineItem from './TimelineItem';
import SendRightPointer from './send-right-pointer';

const timelineData = [
  {
    period: '2013-2016',
    title: 'Art major, Ironi Alef school of Arts and Design, Rabin, Israel',
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

// Enable debug logs
const DEBUG = true;

const Timeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const log = (message: string, data?: any) => {
    if (DEBUG) {
      console.log(`📌 ${message}`, data ? data : '');
    }
  };

  // Initialize and manage scroll events
  useEffect(() => {
    if (!timelineRef.current || !timelineItemsRef.current || !arrowRef.current) return;

    // Get necessary references and measurements
    const timeline = timelineRef.current;
    const timelineItems = Array.from(timelineItemsRef.current.children);
    const arrow = arrowRef.current;

    // Set initial arrow position to first item
    const firstItem = timelineItems[0];
    const firstItemRect = firstItem.getBoundingClientRect();
    const timelineRect = timeline.getBoundingClientRect();

    // Calculate positions once for a more stable reference
    const itemTops = timelineItems.map((item) => {
      const rect = item.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        height: rect.height
      };
    });

    // Initial position on the first item
    const firstItemPosition = itemTops[0].top + itemTops[0].height / 2;
    const firstItemLeftPos = timelineRect.left + 20;

    log('Initial timeline setup', {
      itemTops,
      timelineLeft: timelineRect.left,
      firstItemPosition
    });

    // Set initial arrow position
    arrow.style.top = `${firstItemPosition}px`;
    arrow.style.left = `${firstItemLeftPos}px`;
    arrow.style.opacity = '1';

    // Required measurements for scrolling
    const timelineStart = itemTops[0].top;
    const timelineEnd = itemTops[itemTops.length - 1].top + itemTops[itemTops.length - 1].height;
    const firstItemTop = itemTops[0].top;
    const lastItemTop = itemTops[itemTops.length - 1].top;

    // Flag to track if we've scrolled past the first item
    let isScrolledPastFirstItem = false;

    // Handle scroll events
    const handleScroll = () => {
      // Get current scroll position
      const scrollY = window.scrollY;
      const viewportMiddle = scrollY + window.innerHeight / 2;

      // Make sure the scroll is within the timeline area
      if (viewportMiddle < timelineStart - 200 || viewportMiddle > timelineEnd + 200) {
        return;
      }

      // Updated timelineRect since this can change during scrolling
      const updatedTimelineRect = timeline.getBoundingClientRect();
      const leftPosition = updatedTimelineRect.left + 20;

      // Set arrow left position (which can change if view is resized)
      arrow.style.left = `${leftPosition}px`;

      // Check if we've scrolled past the first item
      if (viewportMiddle > firstItemTop + itemTops[0].height / 2) {
        if (!isScrolledPastFirstItem) {
          log('Scrolled past first item', {
            scrollY,
            viewportMiddle,
            firstItemBottom: firstItemTop + itemTops[0].height
          });
          isScrolledPastFirstItem = true;
        }

        // Calculate how far we've scrolled through the timeline (0 to 1)
        const scrollRange = lastItemTop - firstItemTop;
        const scrollPosition = viewportMiddle - firstItemTop;
        const scrollPercentage = Math.min(Math.max(scrollPosition / scrollRange, 0), 1);

        // Calculate arrow position based on scroll percentage
        const startPos = itemTops[0].top + itemTops[0].height / 2;
        const endPos = itemTops[itemTops.length - 1].top + itemTops[itemTops.length - 1].height / 2;
        const newTop = startPos + scrollPercentage * (endPos - startPos);

        // Set new arrow position
        arrow.style.top = `${newTop}px`;

        // Find which item is currently active based on arrow position
        let newActiveIndex = 0;
        let closestDistance = Infinity;

        itemTops.forEach((item, index) => {
          const itemMiddle = item.top + item.height / 2;
          const distance = Math.abs(newTop - itemMiddle);

          if (distance < closestDistance) {
            closestDistance = distance;
            newActiveIndex = index;
          }
        });

        // Only update state if item index changed
        if (newActiveIndex !== activeItemIndex) {
          log('Active item changed', {
            previousIndex: activeItemIndex,
            newIndex: newActiveIndex,
            arrowPosition: newTop
          });

          setActiveItemIndex(newActiveIndex);

          // Add active class to the current item and remove from others
          timelineItems.forEach((item, index) => {
            if (index === newActiveIndex) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      } else {
        // When at top, keep arrow on first item
        arrow.style.top = `${itemTops[0].top + itemTops[0].height / 2}px`;

        if (isScrolledPastFirstItem) {
          log('Scrolled back to first item', {
            scrollY,
            viewportMiddle,
            firstItemPosition: itemTops[0].top + itemTops[0].height / 2
          });
          isScrolledPastFirstItem = false;
        }

        // Set active item to first
        if (activeItemIndex !== 0) {
          setActiveItemIndex(0);
          timelineItems.forEach((item, index) => {
            if (index === 0) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      }
    };

    // Initial call to set up state
    handleScroll();
    setIsInitialized(true);

    // Bind scroll event
    window.addEventListener('scroll', handleScroll, {passive: true});

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeItemIndex]);

  return (
    <div ref={timelineRef} className='relative py-8'>
      {/* Arrow indicator with built-in CSS transition for smooth movement */}
      <div
        ref={arrowRef}
        className='z-[100] flex items-center justify-center fixed w-5 h-5 bg-blue-500 rounded-full shadow-lg opacity-0 pointer-events-none'
        style={{
          transform: 'translate(-50%, -50%)',
          transition: 'top 0.05s linear, left 0.05s linear' // Faster, smoother transitions
        }}>
        <SendRightPointer />
      </div>

      {/* Timeline items */}
      <div ref={timelineItemsRef} className='flex flex-col gap-8 relative'>
        {/* Timeline vertical line */}
        <div
          className='absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-blue-500 to-blue-300 transition-all duration-700'
          style={{
            height: `${Math.min(100, ((activeItemIndex + 1) / timelineData.length) * 100)}%`
          }}
        />

        {/* Timeline items */}
        {timelineData.map((item, index) => {
          const isActive = index === activeItemIndex;
          const isPast = index < activeItemIndex;

          return (
            <div key={index} data-index={index} className={`relative border-l-2 pl-4 transition-colors duration-300 ${isPast ? 'border-blue-400' : isActive ? 'border-blue-500' : 'border-gray-300'}`}>
              {/* Circle marker */}
              <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full transition-all duration-300 ${isPast ? 'bg-blue-400' : isActive ? 'bg-blue-500 scale-125 shadow-sm shadow-blue-300' : 'border border-gray-300 bg-white'}`} />

              {/* Item content */}
              <TimelineItem index={index} period={item.period} title={item.title} description={item.description} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
