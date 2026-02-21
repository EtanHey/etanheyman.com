import React from "react";
import { TechIconProps } from "./TechIcon";

const OllamaIcon: React.FC<TechIconProps> = ({
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
        <circle cx="12" cy="14" r="7.5" fill="#0053A4" />
        <path
          d="M7.5 9L5.5 2.5 9 7.5 7.5 9zm9 0l2-6.5L15 7.5 16.5 9z"
          fill="#0053A4"
        />
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
        <circle cx="12" cy="14" r="7.5" fill="#0053A4" />
        <path
          d="M7.5 9L5.5 2.5 9 7.5 7.5 9zm9 0l2-6.5L15 7.5 16.5 9z"
          fill="#0053A4"
        />
      </svg>
    </>
  );
};

export default OllamaIcon;
