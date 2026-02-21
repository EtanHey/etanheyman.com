import React from "react";
import { TechIconProps } from "./TechIcon";

const InkIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
  return (
    <>
      <svg
        className={`hidden sm:block ${className}`}
        width={47}
        height={47}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M3 4l9 8-9 8v-3l6-5-6-5V4z" fill="#0053A4" />
        <rect x="14" y="17" width="7" height="3" rx="1" fill="#0053A4" />
      </svg>

      <svg
        className={`sm:hidden ${className}`}
        width={28}
        height={28}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M3 4l9 8-9 8v-3l6-5-6-5V4z" fill="#0053A4" />
        <rect x="14" y="17" width="7" height="3" rx="1" fill="#0053A4" />
      </svg>
    </>
  );
};

export default InkIcon;
