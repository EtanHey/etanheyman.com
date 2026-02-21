import React from "react";
import { TechIconProps } from "./TechIcon";

const AxiomIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
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
        <rect x="1" y="14" width="4.5" height="8" rx="1" fill="#0053A4" />
        <rect x="7" y="10" width="4.5" height="12" rx="1" fill="#0053A4" />
        <rect x="13" y="6" width="4.5" height="16" rx="1" fill="#0053A4" />
        <rect x="19" y="2" width="4.5" height="20" rx="1" fill="#0053A4" />
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
        <rect x="1" y="14" width="4.5" height="8" rx="1" fill="#0053A4" />
        <rect x="7" y="10" width="4.5" height="12" rx="1" fill="#0053A4" />
        <rect x="13" y="6" width="4.5" height="16" rx="1" fill="#0053A4" />
        <rect x="19" y="2" width="4.5" height="20" rx="1" fill="#0053A4" />
      </svg>
    </>
  );
};

export default AxiomIcon;
