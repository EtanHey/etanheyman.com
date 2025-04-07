"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Top SVG components
export const TopRightSvg = () => {
  return (
    <svg width='135' height='195' viewBox='0 0 135 195' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <path
        opacity='0.25'
        d='M24.3242 132.976C11.5807 123.02 3.86186 111.245 1.13913 97.647C-1.58361 84.0488 1.63061 71.4038 10.7555 59.7245L25.8159 40.448C27.8213 37.8813 28.7789 35.7077 28.6704 33.9297C28.5619 32.1517 27.4091 30.4044 25.2119 28.6878C24.4046 28.057 23.3247 27.396 21.9847 26.7308C19.0927 24.4713 18.5113 22.2243 20.2429 20.008L33.5234 3.00963C35.3436 0.679958 37.5779 -0.0312767 40.2103 0.896536C46.3552 3.05799 51.9683 6.13194 57.0677 10.116C65.3338 16.9561 70.1008 24.399 71.3789 32.4527C72.6467 40.4985 70.2191 48.4294 64.0983 56.2636L45.8888 79.5707C37.3116 90.549 37.7608 99.748 47.2647 107.173C52.4766 111.245 57.2716 112.501 61.6681 110.94C66.0565 109.388 70.6698 105.505 75.502 99.3205L106.307 59.8913C108.313 57.3246 110.648 57.074 113.315 59.1579L136.769 77.4816C139.548 79.6533 139.931 82.0277 137.926 84.5944L105.478 126.126C101.008 131.848 98.8191 136.861 98.8931 141.168C98.9855 145.474 101.399 149.484 106.151 153.196C110.902 156.909 115.959 157.473 122.024 155.439C128.09 153.405 133.813 148.945 139.2 142.049C147.874 130.947 154.814 118.125 160.029 103.573C161.652 99.5784 164.148 98.8895 167.51 101.516L189.921 119.026C192.466 121.014 193.232 123.488 192.221 126.467C186.259 142.692 178.712 156.65 169.587 168.329C158.36 182.699 145.158 191.192 129.951 193.804C114.755 196.424 100.616 192.615 87.5247 182.387C73.1665 171.169 65.7482 158.799 65.3163 145.281C51.7375 147.853 38.0633 143.743 24.2876 132.981'
        fill='#E7F5FE'
      />
    </svg>
  );
};

export const TopLeftSvg = () => {
  return (
    <svg width='116' height='196' viewBox='0 0 116 196' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <path
        opacity='0.3'
        d='M92.4876 63.7551C105.055 73.9323 112.568 85.8396 115.053 99.4833C117.538 113.127 114.103 125.714 104.776 137.232L89.3813 156.243C87.3314 158.774 86.3361 160.931 86.4135 162.71C86.4909 164.49 87.6131 166.257 89.7799 168.012C90.5761 168.657 91.6443 169.336 92.9725 170.025C95.8247 172.334 96.3667 174.591 94.5968 176.777L81.0215 193.541C79.161 195.839 76.9146 196.511 74.2988 195.537C68.1926 193.269 62.634 190.097 57.6049 186.025C49.4594 179.042 44.8231 171.517 43.6858 163.442C42.5585 155.375 45.1242 147.488 51.3808 139.762L69.9942 116.776C78.7617 105.949 78.4732 96.7435 69.1003 89.1535C63.9603 84.9912 59.1879 83.6515 54.7648 85.1364C50.35 86.6111 45.6697 90.4125 40.7302 96.5122L9.24134 135.398C7.19147 137.929 4.85222 138.139 2.22176 136.009L-20.9082 117.279C-23.6495 115.059 -23.9911 112.678 -21.9412 110.147L11.2271 69.1872C15.796 63.545 18.0719 58.5707 18.073 54.2625C18.0558 49.9562 15.7131 45.9046 11.0267 42.1096C6.34022 38.3145 1.29463 37.6626 -4.80551 39.5905C-10.9057 41.5184 -16.7053 45.8778 -22.2128 52.679C-31.0791 63.6279 -38.2418 76.3267 -43.7092 90.7855C-45.4018 94.7508 -47.9101 95.396 -51.2259 92.711L-73.3278 74.8132C-75.8373 72.781 -76.5599 70.2938 -75.4974 67.3331C-69.2531 51.2143 -61.4631 37.3907 -52.1358 25.8724C-40.6599 11.7008 -27.3113 3.43892 -12.0617 1.09294C3.17782 -1.26121 17.2487 2.79411 30.1591 13.2488C44.3193 24.7154 51.5206 37.2127 51.7165 50.7364C65.3381 48.4019 78.9386 52.7496 92.5243 63.7511'
        fill='#0085D7'
      />
    </svg>
  );
};

// Bottom SVG components
export const BottomRightSvg = () => {
  return (
    <svg width='173' height='196' viewBox='0 0 173 196' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <path
        opacity='0.3'
        d='M168.488 132.699C181.055 122.522 188.568 110.614 191.053 96.9707C193.538 83.327 190.103 70.74 180.776 59.2217L165.381 40.211C163.331 37.6797 162.336 35.5231 162.413 33.7435C162.491 31.9639 163.613 30.1967 165.78 28.4421C166.576 27.7973 167.644 27.1175 168.972 26.4291C171.825 24.1194 172.367 21.8626 170.597 19.6768L157.021 2.91286C155.161 0.615311 152.915 -0.0568216 150.299 0.916791C144.193 3.18517 138.634 6.3566 133.605 10.4291C125.459 17.4123 120.823 24.9373 119.686 33.0121C118.558 41.0788 121.124 48.9661 127.381 56.6924L145.994 79.678C154.762 90.505 154.473 99.7104 145.1 107.3C139.96 111.463 135.188 112.802 130.765 111.318C126.35 109.843 121.67 106.041 116.73 99.9417L85.2413 61.0562C83.1914 58.5248 80.8522 58.315 78.2217 60.4451L55.0918 79.1754C52.3505 81.3952 52.0088 83.7759 54.0587 86.3073L87.227 127.267C91.796 132.909 94.0719 137.883 94.073 142.191C94.0558 146.498 91.7131 150.549 87.0266 154.344C82.3402 158.139 77.2946 158.791 71.1944 156.863C65.0943 154.936 59.2946 150.576 53.7871 143.775C44.9209 132.826 37.7581 120.127 32.2907 105.668C30.5982 101.703 28.0899 101.058 24.7741 103.743L2.67216 121.641C0.162633 123.673 -0.559963 126.16 0.502519 129.121C6.74687 145.24 14.5368 159.063 23.8641 170.582C35.3401 184.753 48.6886 193.015 63.9382 195.361C79.1778 197.715 93.2486 193.66 106.159 183.205C120.319 171.738 127.521 159.241 127.716 145.718C141.338 148.052 154.939 143.704 168.524 132.703'
        fill='#0085D7'
      />
    </svg>
  );
};

export const BottomLeftSvg = () => {
  return (
    <svg width='172' height='195' viewBox='0 0 172 195' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <path
        opacity='0.25'
        d='M3.35656 61.8945C-9.38691 71.8508 -17.1058 83.6253 -19.8285 97.2235C-22.5512 110.822 -19.337 123.467 -10.2122 135.146L4.84828 154.422C6.85365 156.989 7.81124 159.163 7.70276 160.941C7.59428 162.719 6.44147 164.466 4.24432 166.183C3.43699 166.813 2.35713 167.475 1.01711 168.14C-1.87495 170.399 -2.45629 172.646 -0.724741 174.863L12.5558 191.861C14.376 194.191 16.6103 194.902 19.2427 193.974C25.3876 191.812 31.0006 188.739 36.1001 184.754C44.3662 177.914 49.1332 170.472 50.4112 162.418C51.6791 154.372 49.2515 146.441 43.1307 138.607L24.9212 115.3C16.344 104.322 16.7932 95.1225 26.2971 87.6972C31.5089 83.6253 36.304 82.3691 40.7005 83.9309C45.0889 85.4825 49.7022 89.365 54.5344 95.55L85.3398 134.979C87.3452 137.546 89.6804 137.796 92.3477 135.713L115.801 117.389C118.581 115.217 118.964 112.843 116.958 110.276L84.51 68.744C80.0401 63.0229 77.8514 58.0097 77.9255 53.7021C78.0179 49.3968 80.4309 45.3867 85.1829 41.674C89.9349 37.9613 94.9911 37.3975 101.057 39.4316C107.122 41.4657 112.845 45.9257 118.233 52.8219C126.907 63.924 133.847 76.7458 139.061 91.2978C140.684 95.2921 143.181 95.9809 146.543 93.3541L168.954 75.8448C171.498 73.8568 172.264 71.3825 171.254 68.4038C165.291 52.1784 157.744 38.2209 148.619 26.5417C137.392 12.1719 124.19 3.67835 108.984 1.06657C93.7875 -1.55318 79.648 2.25595 66.557 12.4837C52.1989 23.7015 44.7806 36.0712 44.3487 49.5894C30.7699 47.0175 17.0956 51.1272 3.32002 61.8899'
        fill='#E7F5FE'
      />
    </svg>
  );
};

// Main component that positions SVGs based on page type
const BottomMobileBgCover = () => {
  const [bottomRightPosition, setBottomRightPosition] = useState(0);
  const [bottomLeftPosition, setBottomLeftPosition] = useState(168);
  const [showBottomSVGs, setShowBottomSVGs] = useState(false);

  const getRandomPosition = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Generate random positions on component mount and check for content
  useEffect(() => {
    // Random value between -15.55 and -8.5 for bottom right
    const randomBottomRight = getRandomPosition(15.55, -8.5);
    setBottomRightPosition(randomBottomRight);

    // Random value between 168 and 223 for bottom left
    const randomBottomLeft = getRandomPosition(168, 223);
    setBottomLeftPosition(randomBottomLeft);

    // Check if page has enough content to show bottom SVGs
    const checkContentHeight = () => {
      // Use a simple approach - if the page is scrollable, show the SVGs
      const isScrollable = document.body.scrollHeight > window.innerHeight;
      setShowBottomSVGs(isScrollable);
    };

    // Initial check
    checkContentHeight();

    // Set up a more reliable check after content has fully loaded
    const timer = setTimeout(checkContentHeight, 500);

    // Check on window resize
    window.addEventListener("resize", checkContentHeight);

    // Check on scroll - might indicate content has loaded or expanded
    window.addEventListener("scroll", checkContentHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkContentHeight);
      window.removeEventListener("scroll", checkContentHeight);
    };
  }, []);

  // If there's not enough content, don't render the SVGs
  if (!showBottomSVGs) {
    return null;
  }

  return (
    <div className='absolute h-fit bottom-0 left-0 w-full pointer-events-none' aria-hidden='true'>
      {/* Bottom Right SVG */}
      <div className='absolute h-fit right-0 bottom-0' style={{ bottom: `${bottomRightPosition}px` }}>
        <span className='absolute -right-3 size-36 bg-blue-500 blur-[45px] opacity-60' style={{ bottom: `${bottomRightPosition}px` }}></span>
        <BottomRightSvg />
      </div>

      {/* Bottom Left SVG */}
      <div className='absolute h-fit bottom-0 left-0' style={{ bottom: `${bottomLeftPosition}px` }}>
        <span className='absolute -left-3 size-36 bg-blue-200 blur-[45px] opacity-60' style={{ bottom: `${bottomLeftPosition - 150}px` }}></span>
        <BottomLeftSvg />
      </div>
    </div>
  );
};
const TopMobileBgCover = () => {
  const pathname = usePathname();

  // Next.js handles 404/not-found pages differently than explicit paths
  // When a not-found.tsx/js is rendered, we get the same layout but a different page component
  // For styling purposes, we still want to identify if we're on home or error-like pages
  const isHomeOrNotFoundPage = pathname === "/" || pathname === "";

  return (
    <div className='absolute top-0 left-0 h-fit w-full pointer-events-none' aria-hidden='true'>
      {/* Top Right SVG - fixed position for all pages */}
      <div className='absolute h-fit right-0 -top-[54px]'>
        <span className='absolute -right-3 -bottom-5 size-36 bg-blue-200 blur-[45px] opacity-60'></span>
        <TopRightSvg />
      </div>

      {/* Top Left SVG - position changes based on page type */}
      <div className={`relative h-fit left-0 ${isHomeOrNotFoundPage ? "top-[175px]" : "top-[325px]"}`}>
        <span className='absolute -left-3 size-36 bg-blue-500 blur-[45px] opacity-60'></span>
        <TopLeftSvg />
      </div>
    </div>
  );
};

export { BottomMobileBgCover, TopMobileBgCover };
