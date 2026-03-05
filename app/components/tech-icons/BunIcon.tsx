import React from "react";
import { TechIconProps } from "./TechIcon";

const BunIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
  return (
    <>
      <svg
        className={`hidden sm:block ${className}`}
        width={47}
        height={47}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M63.3 44.5c0 14.3-10.4 23.5-23.3 23.5S16.7 58.8 16.7 44.5c0-8.1 4.2-15.1 6.9-19.2 2.5-3.8 8.6-11.1 10.6-13.3.7-.8 1.5-1.4 2.4-1.7.9-.3 1.8-.3 2.7-.1L40 12l.7-.3c.9-.2 1.8-.2 2.7.1.9.3 1.7.9 2.4 1.7 2 2.2 8.1 9.5 10.6 13.3 2.7 4.1 6.9 11.1 6.9 19.2z"
          stroke="#0053A4"
          strokeWidth="2.5"
          fill="none"
        />
        <ellipse cx="32" cy="43" rx="3.5" ry="4.5" fill="#0053A4" />
        <ellipse cx="48" cy="43" rx="3.5" ry="4.5" fill="#0053A4" />
        <path
          d="M36 53c1.2 1.6 2.6 2.2 4 2.2s2.8-.6 4-2.2"
          stroke="#0053A4"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <svg
        className={`sm:hidden ${className}`}
        width={28}
        height={28}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M63.3 44.5c0 14.3-10.4 23.5-23.3 23.5S16.7 58.8 16.7 44.5c0-8.1 4.2-15.1 6.9-19.2 2.5-3.8 8.6-11.1 10.6-13.3.7-.8 1.5-1.4 2.4-1.7.9-.3 1.8-.3 2.7-.1L40 12l.7-.3c.9-.2 1.8-.2 2.7.1.9.3 1.7.9 2.4 1.7 2 2.2 8.1 9.5 10.6 13.3 2.7 4.1 6.9 11.1 6.9 19.2z"
          stroke="#0053A4"
          strokeWidth="2.5"
          fill="none"
        />
        <ellipse cx="32" cy="43" rx="3.5" ry="4.5" fill="#0053A4" />
        <ellipse cx="48" cy="43" rx="3.5" ry="4.5" fill="#0053A4" />
        <path
          d="M36 53c1.2 1.6 2.6 2.2 4 2.2s2.8-.6 4-2.2"
          stroke="#0053A4"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </>
  );
};

export default BunIcon;
