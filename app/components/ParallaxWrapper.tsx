'use client';

import React, {useEffect} from 'react';
import {ParallaxProvider} from 'react-scroll-parallax';

interface ParallaxWrapperProps {
  children: React.ReactNode;
}

const ParallaxWrapper = ({children}: ParallaxWrapperProps) => {
  useEffect(() => {
    console.log('ParallaxWrapper mounted');
    return () => {
      console.log('ParallaxWrapper unmounted');
    };
  }, []);

  console.log('ParallaxWrapper rendering');
  return <ParallaxProvider>{children}</ParallaxProvider>;
};

export default ParallaxWrapper;
