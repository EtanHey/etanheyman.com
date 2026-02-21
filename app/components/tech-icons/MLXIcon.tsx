import React from "react";
import { TechIconProps } from "./TechIcon";

const MLXIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
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
        <rect x="6" y="6" width="12" height="12" rx="2" fill="#0053A4" />
        <rect x="9" y="2" width="2" height="4" rx="0.5" fill="#0053A4" />
        <rect x="13" y="2" width="2" height="4" rx="0.5" fill="#0053A4" />
        <rect x="9" y="18" width="2" height="4" rx="0.5" fill="#0053A4" />
        <rect x="13" y="18" width="2" height="4" rx="0.5" fill="#0053A4" />
        <rect x="2" y="9" width="4" height="2" rx="0.5" fill="#0053A4" />
        <rect x="2" y="13" width="4" height="2" rx="0.5" fill="#0053A4" />
        <rect x="18" y="9" width="4" height="2" rx="0.5" fill="#0053A4" />
        <rect x="18" y="13" width="4" height="2" rx="0.5" fill="#0053A4" />
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
        <rect x="6" y="6" width="12" height="12" rx="2" fill="#0053A4" />
        <rect x="9" y="2" width="2" height="4" rx="0.5" fill="#0053A4" />
        <rect x="13" y="2" width="2" height="4" rx="0.5" fill="#0053A4" />
        <rect x="9" y="18" width="2" height="4" rx="0.5" fill="#0053A4" />
        <rect x="13" y="18" width="2" height="4" rx="0.5" fill="#0053A4" />
        <rect x="2" y="9" width="4" height="2" rx="0.5" fill="#0053A4" />
        <rect x="2" y="13" width="4" height="2" rx="0.5" fill="#0053A4" />
        <rect x="18" y="9" width="4" height="2" rx="0.5" fill="#0053A4" />
        <rect x="18" y="13" width="4" height="2" rx="0.5" fill="#0053A4" />
      </svg>
    </>
  );
};

export default MLXIcon;
