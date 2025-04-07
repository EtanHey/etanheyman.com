import React from "react";
import { TechIconProps } from "./TechIcon";

const MakeIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
  return (
    <>
      {/* Desktop version */}
      <svg
        className={`hidden md:block ${className}`}
        width={54}
        height={38}
        viewBox="0 0 54 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M52.6626 37.3831H43.4339C42.7292 37.3831 42.1602 36.8103 42.1602 36.1094V2.03611C42.1602 1.33143 42.733 0.76242 43.4339 0.76242H52.6626C53.3672 0.76242 53.9363 1.33143 53.9363 2.03611V36.1094C53.9363 36.8103 53.3672 37.3831 52.6626 37.3831ZM11.584 36.9422L26.8834 6.49782C27.1999 5.86851 26.9475 5.10354 26.3182 4.787L18.073 0.64183C17.4437 0.32529 16.6788 0.577769 16.3622 1.20708L1.06279 31.6514C0.746254 32.2808 0.998732 33.0457 1.62804 33.3623L9.87315 37.5074C10.5025 37.8202 11.2674 37.5677 11.584 36.9422ZM34.2279 36.8216L40.7735 3.63765C40.9091 2.94805 40.4645 2.28106 39.7749 2.14163L30.7271 0.313987C30.0375 0.174559 29.363 0.622988 29.2235 1.31259V1.31637L22.6779 34.5003C22.5423 35.1899 22.9869 35.8569 23.6766 35.9963L32.7243 37.824C33.4139 37.9634 34.0885 37.515 34.2279 36.8254C34.2279 36.8254 34.2279 36.8254 34.2279 36.8216Z"
          fill="#0053A4"
        />
      </svg>

      {/* Mobile version */}
      <svg
        className={`md:hidden ${className}`}
        width={32}
        height={23}
        viewBox="0 0 32 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M30.8974 22.0806H25.4697C25.0553 22.0806 24.7206 21.7437 24.7206 21.3315V1.29171C24.7206 0.877262 25.0575 0.542603 25.4697 0.542603H30.8974C31.3119 0.542603 31.6465 0.877262 31.6465 1.29171V21.3315C31.6465 21.7437 31.3119 22.0806 30.8974 22.0806ZM6.73753 21.8213L15.7357 3.91581C15.9219 3.54569 15.7734 3.09578 15.4033 2.90961L10.554 0.471679C10.1839 0.28551 9.73397 0.434002 9.5478 0.804124L0.549625 18.7096C0.363456 19.0797 0.511948 19.5296 0.88207 19.7158L5.73133 22.1537C6.10146 22.3377 6.55136 22.1892 6.73753 21.8213ZM20.0553 21.7504L23.905 2.23364C23.9848 1.82805 23.7233 1.43577 23.3177 1.35377L17.9963 0.278862C17.5908 0.196859 17.194 0.460598 17.112 0.866181V0.868399L13.2623 20.3851C13.1825 20.7907 13.4441 21.183 13.8496 21.265L19.171 22.3399C19.5766 22.4219 19.9733 22.1582 20.0553 21.7526C20.0553 21.7526 20.0553 21.7526 20.0553 21.7504Z"
          fill="#0053A4"
        />
      </svg>
    </>
  );
};

export default MakeIcon;
