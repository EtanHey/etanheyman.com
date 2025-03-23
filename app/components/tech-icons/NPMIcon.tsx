import React from 'react';
import { TechIconProps } from './TechIcon';

const NPMIcon: React.FC<TechIconProps> = ({ className = '', ...props }) => {
  return (
    <>
      {/* Desktop version */}
      <svg 
        className={`hidden md:block ${className}`}
        width={47} 
        height={47} 
        viewBox="0 0 47 47" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
      >
        <path d="M0.647949 0.366333H46.6279V46.3463H0.647949V0.366333Z" fill="#0053A4"/>
<path d="M5.58654 5.30457V41.4062H23.4801V14.4086H32.5842V41.4062H41.6882V5.30457H5.58654Z" fill="#E7F5FE"/>
      </svg>
      
      {/* Mobile version */}
      <svg 
        className={`md:hidden ${className}`}
        width={28} 
        height={28} 
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
      >
        <path d="M0.309433 0.399658H27.352V27.4422H0.309433V0.399658Z" fill="#0053A4"/>
<path d="M3.21401 3.30402V24.5368H13.7379V8.65846H19.0923V24.5368H24.4468V3.30402H3.21401Z" fill="#E7F5FE"/>
      </svg>
    </>
  );
};

export default NPMIcon;
