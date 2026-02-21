import React from "react";
import { TechIconProps } from "./TechIcon";

const SentenceTransformersIcon: React.FC<TechIconProps> = ({
  className = "",
  ...props
}) => {
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
        <rect x="2" y="4" width="6" height="2" rx="1" fill="#0053A4" />
        <rect x="2" y="9" width="6" height="2" rx="1" fill="#0053A4" />
        <rect x="2" y="14" width="6" height="2" rx="1" fill="#0053A4" />
        <rect x="2" y="19" width="6" height="2" rx="1" fill="#0053A4" />
        <rect x="13" y="11" width="5" height="2" fill="#0053A4" />
        <path d="M17 7l5 5-5 5V7z" fill="#0053A4" />
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
        <rect x="2" y="4" width="6" height="2" rx="1" fill="#0053A4" />
        <rect x="2" y="9" width="6" height="2" rx="1" fill="#0053A4" />
        <rect x="2" y="14" width="6" height="2" rx="1" fill="#0053A4" />
        <rect x="2" y="19" width="6" height="2" rx="1" fill="#0053A4" />
        <rect x="13" y="11" width="5" height="2" fill="#0053A4" />
        <path d="M17 7l5 5-5 5V7z" fill="#0053A4" />
      </svg>
    </>
  );
};

export default SentenceTransformersIcon;
