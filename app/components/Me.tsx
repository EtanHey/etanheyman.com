import Image from 'next/image';
import React from 'react';

const Me = () => {
  return (
    <div className='relative self-start'>
      <Image className='rounded-b-full bg-blue-200 border-4 border-white rounded-r-full' src='/Me2.png' alt='Me' width={100} height={100} />
    </div>
  );
};

export default Me;
