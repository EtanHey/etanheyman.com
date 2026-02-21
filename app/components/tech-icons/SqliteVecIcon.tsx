import React from "react";
import { TechIconProps } from "./TechIcon";

const SqliteVecIcon: React.FC<TechIconProps> = ({
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
        <ellipse cx="8" cy="5.5" rx="5.5" ry="2.5" fill="#0053A4" />
        <rect x="2.5" y="5.5" width="11" height="11" fill="#0053A4" />
        <ellipse cx="8" cy="16.5" rx="5.5" ry="2.5" fill="#0053A4" />
        <path d="M16 8l5.5 4-5.5 4V8z" fill="#0053A4" />
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
        <ellipse cx="8" cy="5.5" rx="5.5" ry="2.5" fill="#0053A4" />
        <rect x="2.5" y="5.5" width="11" height="11" fill="#0053A4" />
        <ellipse cx="8" cy="16.5" rx="5.5" ry="2.5" fill="#0053A4" />
        <path d="M16 8l5.5 4-5.5 4V8z" fill="#0053A4" />
      </svg>
    </>
  );
};

export default SqliteVecIcon;
