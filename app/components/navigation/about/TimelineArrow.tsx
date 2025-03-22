'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import SendRightPointer from './send-right-pointer';

// Using a more generic type definition that works with how React refs are typed
interface TimelineArrowProps {
  timelineRef: React.RefObject<HTMLDivElement> | {current: HTMLDivElement | null};
  timelineItemsRef: React.RefObject<HTMLDivElement> | {current: HTMLDivElement | null};
}

// Enable debug mode in development
const DEBUG_MODE = process.env.NODE_ENV === 'development';

// How many ms to wait before allowing another position update
const SCROLL_THROTTLE = 50;

const TimelineArrow = ({timelineRef, timelineItemsRef}: TimelineArrowProps) => {
  const arrowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({top: 0, left: 0});
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [timelineRange, setTimelineRange] = useState({start: 0, end: 0});

  // Refs for performance optimization
  const rafId = useRef<number | null>(null);
  const lastUpdateTime = useRef(0);
  const lastScrollY = useRef(0);
  const isScrolling = useRef(false);
  const currentPosition = useRef(position);
  const currentActiveItem = useRef(activeItemIndex);
  const isCurrentlyVisible = useRef(isVisible);

  // Cache position and active item in ref for throttling
  useEffect(() => {
    currentPosition.current = position;
    currentActiveItem.current = activeItemIndex;
    isCurrentlyVisible.current = isVisible;
  }, [position, activeItemIndex, isVisible]);

  // Memoized update handler to prevent recreation on every render
  const updateArrowPosition = useCallback(
    (items: Element[], viewportHeight: number) => {
      // Find which timeline item is closest to the viewport center
      if (items.length === 0) return;

      const viewportMiddle = viewportHeight / 2;
      let closestItem = currentActiveItem.current;
      let closestDistance = Infinity;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemMiddle = rect.top + rect.height / 2;
        const distance = Math.abs(itemMiddle - viewportMiddle);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = index;
        }
      });

      // Only update state if the item changed
      if (closestItem !== currentActiveItem.current) {
        if (DEBUG_MODE) {
          console.log('🔄 Active item changed:', {
            previous: currentActiveItem.current,
            new: closestItem
          });
        }
        setActiveItemIndex(closestItem);
      }

      // Get active item position
      const activeItem = items[closestItem];
      if (!activeItem) return;

      const activeRect = activeItem.getBoundingClientRect();

      // Only proceed if timeline ref is available
      if (!timelineRef.current) return;
      const timelineRect = timelineRef.current.getBoundingClientRect();

      // Position arrow to the left of the timeline item with adjusted offset
      const topPosition = activeRect.top + activeRect.height / 2;
      const leftPosition = timelineRect.left;

      // Only update position if it changed significantly (reduces renders)
      const currentPos = currentPosition.current;
      const isSignificantChange = Math.abs(currentPos.top - topPosition) > 3 || Math.abs(currentPos.left - leftPosition) > 3;

      if (isSignificantChange) {
        setPosition({
          top: topPosition,
          left: leftPosition
        });
      }
    },
    [timelineRef]
  );

  // Initialize timeline and setup event listeners
  useEffect(() => {
    if (!timelineRef.current || !timelineItemsRef.current) {
      if (DEBUG_MODE) console.warn('⚠️ Timeline or items refs not available');
      return;
    }

    // Calculate timeline position and boundaries
    const calculateTimelinePosition = () => {
      if (!timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      // Increase buffer before timeline to ensure earlier detection
      const start = window.scrollY + timelineRect.top - 300;
      const end = window.scrollY + timelineRect.bottom + 150; // Add buffer after timeline

      if (DEBUG_MODE) {
        console.log('📏 Timeline boundaries:', {start, end, currentScroll: window.scrollY});
      }
      setTimelineRange({start, end});

      // Force set active item to first item (index 0)
      setActiveItemIndex(0);

      // Immediately update arrow position for the first item
      if (timelineItemsRef.current && timelineItemsRef.current.children.length > 0) {
        const items = Array.from(timelineItemsRef.current.children);
        // Manually trigger a position update for the first item
        updateArrowPosition(items, window.innerHeight);
      }
    };

    // Calculate initial positions
    calculateTimelinePosition();

    // Recalculate on resize (debounced)
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        calculateTimelinePosition();
        // Force a position update after resize
        if (timelineItemsRef.current) {
          const items = Array.from(timelineItemsRef.current.children);
          updateArrowPosition(items, window.innerHeight);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [timelineRef, timelineItemsRef, updateArrowPosition]);

  // Handle scroll and update arrow position with throttling
  useEffect(() => {
    if (!timelineRef.current || !timelineItemsRef.current) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const now = Date.now();

      // Skip this update if we've updated recently (throttling)
      const shouldThrottle = now - lastUpdateTime.current < SCROLL_THROTTLE;

      // But always check visibility on larger scroll changes
      const isLargeScroll = Math.abs(scrollY - lastScrollY.current) > 50;

      // Check if we're in the timeline section
      const isInTimelineRange = scrollY >= timelineRange.start && scrollY <= timelineRange.end;

      // Check visibility (even during throttling for large scroll changes)
      if (isCurrentlyVisible.current !== isInTimelineRange && (!shouldThrottle || isLargeScroll)) {
        if (DEBUG_MODE) {
          console.log('👁️ Arrow visibility changing:', {
            visible: isInTimelineRange,
            scrollY,
            timelineStart: timelineRange.start,
            timelineEnd: timelineRange.end
          });
        }
        setIsVisible(isInTimelineRange);

        // If becoming visible, ensure the first item is selected initially
        if (isInTimelineRange && !isCurrentlyVisible.current && timelineItemsRef.current) {
          // When first becoming visible, prioritize the first item
          setActiveItemIndex(0);

          // Force update position for the first item
          const items = Array.from(timelineItemsRef.current.children);
          if (items.length > 0) {
            const firstItem = items[0] as HTMLElement;
            const firstItemRect = firstItem.getBoundingClientRect();

            if (timelineRef.current) {
              const timelineRect = timelineRef.current.getBoundingClientRect();
              setPosition({
                top: firstItemRect.top + firstItemRect.height / 2,
                left: timelineRect.left
              });
            }
          }
        }
      }

      // Skip position updates during throttling unless it's a large scroll
      if (shouldThrottle && !isLargeScroll) {
        isScrolling.current = false;
        return;
      }

      // Update last time and scrollY
      lastUpdateTime.current = now;
      lastScrollY.current = scrollY;

      // Only update position if in timeline range
      if (isInTimelineRange && timelineItemsRef.current) {
        const items = Array.from(timelineItemsRef.current.children);
        updateArrowPosition(items, viewportHeight);
      }

      isScrolling.current = false;
    };

    const scrollListener = () => {
      if (!isScrolling.current) {
        isScrolling.current = true;
        rafId.current = requestAnimationFrame(handleScroll);
      }
    };

    window.addEventListener('scroll', scrollListener, {passive: true});

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', scrollListener);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [timelineRef, timelineItemsRef, timelineRange, updateArrowPosition]);

  // Handle click to scroll to timeline - memoized to prevent recreation
  const handleClick = useCallback(() => {
    if (!timelineRef.current) return;

    const timelineTop = timelineRef.current.getBoundingClientRect().top + window.scrollY;
    if (DEBUG_MODE) {
      console.log('🖱️ Arrow clicked - scrolling to timeline', {targetY: timelineTop - 50});
    }

    window.scrollTo({
      top: timelineTop - 50,
      behavior: 'smooth'
    });
  }, [timelineRef]);

  if (!isVisible) {
    if (DEBUG_MODE) console.log('🚫 Arrow not rendered - visibility check failed');
    return null;
  }

  if (DEBUG_MODE) {
    console.log('🖌️ Rendering arrow:', {
      position,
      activeItemIndex
    });
  }

  return (
    <div
      ref={arrowRef}
      onClick={handleClick}
      className='z-[100] flex items-center justify-center fixed
        w-5.5 h-5.5 bg-blue-500 rounded-full shadow-lg cursor-pointer 
        hover:scale-110 transition-all duration-300'
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'top 0.3s ease-out, left 0.3s ease-out',
        willChange: 'transform, top, left',
        pointerEvents: 'auto'
      }}
      title='Navigate timeline'
      aria-label='Timeline navigation arrow'
      role='button'
      tabIndex={0}>
      <SendRightPointer />
    </div>
  );
};

export default TimelineArrow;
