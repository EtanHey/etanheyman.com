import React from "react";
import { TechIconProps } from "./TechIcon";

const GeminiIcon: React.FC<TechIconProps> = ({
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
        <path
          d="M12 1Q12 12 1 12Q12 12 12 23Q12 12 23 12Q12 12 12 1z"
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
        <path
          d="M12 1Q12 12 1 12Q12 12 12 23Q12 12 23 12Q12 12 12 1z"
          fill="#0053A4"
        />
      </svg>
    </>
  );
};

export default GeminiIcon;
