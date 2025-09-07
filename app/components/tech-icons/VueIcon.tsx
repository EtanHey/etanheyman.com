import React from "react";
import { TechIconProps } from "./TechIcon";

const VueIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
  return (
    <>
      {/* Desktop version */}
      <svg
        className={`hidden sm:block ${className}`}
        width={54}
        height={47}
        viewBox="0 0 54 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M0.0341797 0.206909L26.5342 46.2069L53.0342 0.206909H42.4342L26.5342 27.8069L10.5017 0.206909H0.0341797Z"
          fill="#0053A4"
        />
        <path
          d="M10.2367 0.206909L26.4688 27.9402L42.5667 0.206909H32.6396L26.4688 10.8736L20.1637 0.206909H10.2367Z"
          fill="#0F82EB"
        />
      </svg>

      {/* Mobile version */}
      <svg
        className={`sm:hidden ${className}`}
        width={33}
        height={28}
        viewBox="0 0 33 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M0.80957 0.989868L16.4442 27.9597L32.0789 0.989868L25.825 0.989868L16.4442 17.1718L6.98527 0.989868L0.80957 0.989868Z"
          fill="#0053A4"
        />
        <path
          d="M6.82892 0.989868L16.4056 17.2499L25.9032 0.989868L20.0464 0.989868L16.4056 7.24374L12.6858 0.989868L6.82892 0.989868Z"
          fill="#0F82EB"
        />
      </svg>
    </>
  );
};

export default VueIcon;
