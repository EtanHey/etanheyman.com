'use client';

import {useRef} from 'react';
import TimelineArrow from './TimelineArrow';
import TimelineItem from './TimelineItem';

const Timeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={timelineRef} className='relative py-8'>
      <TimelineArrow timelineRef={timelineRef} timelineItemsRef={timelineItemsRef} />

      <div ref={timelineItemsRef} className='flex flex-col gap-8'>
        <TimelineItem index={0} period='2013-2016' title='Art major, Ironi Alef school of Arts and Design, Rabin, Israel' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem index={1} period='2016-2019' title='IDF service' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem index={2} period='2019-2021' title='Service industry' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem index={3} period='2021-2022' title='Logistic manager, Full-Stack student' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem index={4} period='2022-2023' title='JamsNext internship' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />

        <TimelineItem index={5} period='2023-TODAY' title='Freelance Full-stack developer' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' />
      </div>
    </div>
  );
};

export default Timeline;
