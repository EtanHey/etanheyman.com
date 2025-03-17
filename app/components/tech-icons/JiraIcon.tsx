import React from 'react';
import { TechIconProps } from './TechIcon';

const JiraIcon: React.FC<TechIconProps> = ({ className = '', ...props }) => {
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
        <path d="M44.5006 0.366333H22.359C22.359 3.01719 23.4121 5.55948 25.2865 7.43392C27.161 9.30836 29.7032 10.3614 32.3541 10.3614H36.4328V14.2995C36.4364 19.8146 40.9063 24.2847 46.4214 24.2883V2.28712C46.4214 1.2266 45.5617 0.366333 44.5006 0.366333Z" fill="#0053A4"/>
<path d="M33.5451 11.3987H11.4036C11.407 16.9138 15.8769 21.3839 21.3922 21.3875H25.4709V25.3382C25.478 30.8533 29.9509 35.3203 35.466 35.3203V13.3199C35.466 12.259 34.6059 11.3987 33.5451 11.3987Z" fill="#0053A4"/>
<path d="M22.583 22.4247H0.441406C0.441406 27.9449 4.91652 32.4198 10.4365 32.4198H14.528V36.3577C14.5316 41.8678 18.9938 46.3359 24.504 46.3463V24.3457C24.504 23.2848 23.6439 22.4247 22.583 22.4247Z" fill="#0053A4"/>
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
        <path d="M26.4494 0.399658L13.4271 0.399658C13.4271 1.95873 14.0464 3.45394 15.1488 4.55637C16.2513 5.6588 17.7465 6.27814 19.3056 6.27814H21.7044V8.59429C21.7065 11.8379 24.3354 14.4669 27.5791 14.4691V1.52935C27.5791 0.905613 27.0734 0.399658 26.4494 0.399658Z" fill="#0053A4"/>
<path d="M20.006 6.88823L6.98378 6.88823C6.98579 10.1319 9.61471 12.7609 12.8585 12.763H15.2573V15.0865C15.2615 18.3302 17.8922 20.9574 21.1358 20.9574V8.01813C21.1358 7.39418 20.63 6.88823 20.006 6.88823Z" fill="#0053A4"/>
<path d="M13.5588 13.373H0.536499C0.536499 16.6196 3.16848 19.2515 6.41498 19.2515H8.82136V21.5676C8.82348 24.8082 11.4478 27.4361 14.6886 27.4422V14.5028C14.6886 13.8789 14.1828 13.373 13.5588 13.373Z" fill="#0053A4"/>
      </svg>
    </>
  );
};

export default JiraIcon;
