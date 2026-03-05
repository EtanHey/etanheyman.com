import React from "react";
import { TechIconProps } from "./TechIcon";

const GrammyIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
  return (
    <>
      <svg
        className={`hidden sm:block ${className}`}
        width={47}
        height={47}
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="m65.44,91.86h37.72l56.84,75.33L273.8,15.01l29.66-15.01-5.41,30.48-120.66,165.91v123.6h-35.29v-123.6l-76.65-104.53Z"
          fill="#0053A4"
        />
      </svg>

      <svg
        className={`sm:hidden ${className}`}
        width={28}
        height={28}
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="m65.44,91.86h37.72l56.84,75.33L273.8,15.01l29.66-15.01-5.41,30.48-120.66,165.91v123.6h-35.29v-123.6l-76.65-104.53Z"
          fill="#0053A4"
        />
      </svg>
    </>
  );
};

export default GrammyIcon;
