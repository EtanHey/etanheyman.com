import React from "react";
import { TechIconProps } from "./TechIcon";

const WhisperCppIcon: React.FC<TechIconProps> = ({
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
        <rect x="2" y="8" width="2.5" height="8" rx="1.25" fill="#0053A4" />
        <rect x="6.5" y="4" width="2.5" height="16" rx="1.25" fill="#0053A4" />
        <rect x="11" y="6" width="2.5" height="12" rx="1.25" fill="#0053A4" />
        <rect x="15.5" y="3" width="2.5" height="18" rx="1.25" fill="#0053A4" />
        <rect x="20" y="7" width="2.5" height="10" rx="1.25" fill="#0053A4" />
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
        <rect x="2" y="8" width="2.5" height="8" rx="1.25" fill="#0053A4" />
        <rect x="6.5" y="4" width="2.5" height="16" rx="1.25" fill="#0053A4" />
        <rect x="11" y="6" width="2.5" height="12" rx="1.25" fill="#0053A4" />
        <rect x="15.5" y="3" width="2.5" height="18" rx="1.25" fill="#0053A4" />
        <rect x="20" y="7" width="2.5" height="10" rx="1.25" fill="#0053A4" />
      </svg>
    </>
  );
};

export default WhisperCppIcon;
