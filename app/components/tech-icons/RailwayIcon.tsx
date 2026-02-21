import React from "react";
import { TechIconProps } from "./TechIcon";

const RailwayIcon: React.FC<TechIconProps> = ({
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
        <rect x="5" y="2" width="3" height="20" rx="1" fill="#0053A4" />
        <rect x="16" y="2" width="3" height="20" rx="1" fill="#0053A4" />
        <rect x="3" y="5" width="18" height="2.5" rx="0.5" fill="#0053A4" />
        <rect x="3" y="11" width="18" height="2.5" rx="0.5" fill="#0053A4" />
        <rect x="3" y="17" width="18" height="2.5" rx="0.5" fill="#0053A4" />
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
        <rect x="5" y="2" width="3" height="20" rx="1" fill="#0053A4" />
        <rect x="16" y="2" width="3" height="20" rx="1" fill="#0053A4" />
        <rect x="3" y="5" width="18" height="2.5" rx="0.5" fill="#0053A4" />
        <rect x="3" y="11" width="18" height="2.5" rx="0.5" fill="#0053A4" />
        <rect x="3" y="17" width="18" height="2.5" rx="0.5" fill="#0053A4" />
      </svg>
    </>
  );
};

export default RailwayIcon;
