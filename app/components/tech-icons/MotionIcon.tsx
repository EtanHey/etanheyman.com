import React from "react";
import { TechIconProps } from "./TechIcon";

const MotionIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
  return (
    <>
      {/* Desktop version */}
      <svg
        className={`hidden sm:block ${className}`}
        width={47}
        height={47}
        viewBox="0 0 47 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M46.7412 0.919556V23.9196L35.2412 35.4196L23.7412 46.9196L12.2412 35.4196L23.7412 23.9196L46.7412 0.919556Z"
          fill="#0053A4"
        />
        <path
          d="M46.7412 23.9196V46.9196L35.2412 35.4196L46.7412 23.9196Z"
          fill="#002072"
        />
        <path
          d="M23.7412 23.9196L12.2412 35.4196L0.741211 46.9196V0.919556L23.7412 23.9196Z"
          fill="#0F82EB"
        />
      </svg>

      {/* Mobile version */}
      <svg
        className={`sm:hidden ${className}`}
        width={28}
        height={28}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M27.7443 0.33606V13.8632L20.9807 20.6268L14.2171 27.3904L7.45353 20.6268L14.2171 13.8632L27.7443 0.33606Z"
          fill="#0053A4"
        />
        <path
          d="M27.7443 13.8632V27.3904L20.9807 20.6268L27.7443 13.8632Z"
          fill="#002072"
        />
        <path
          d="M14.2171 13.8632L7.45353 20.6268L0.689941 27.3904L0.689941 0.33606L14.2171 13.8632Z"
          fill="#0F82EB"
        />
      </svg>
    </>
  );
};

export default MotionIcon;
