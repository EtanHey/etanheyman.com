import React from "react";
import { TechIconProps } from "./TechIcon";

const MaterialUIIcon: React.FC<TechIconProps> = ({
  className = "",
  ...props
}) => {
  return (
    <>
      {/* Desktop version */}
      <svg
        className={`hidden md:block ${className}`}
        width={54}
        height={43}
        viewBox="0 0 54 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M0.344727 23.8286V0.919556L20.2197 12.3741V20.0105L6.96973 12.3741V27.6468L0.344727 23.8286Z"
          fill="#0F82EB"
        />
        <path
          d="M20.2197 12.3741L40.0947 0.919556V23.8286L26.8447 31.465L20.2197 27.6468L33.4697 20.0105V12.3741L20.2197 20.0105V12.3741Z"
          fill="#0053A4"
        />
        <path
          d="M20.2197 27.6468V35.2832L33.4697 42.9196V35.2832L20.2197 27.6468Z"
          fill="#0F82EB"
        />
        <path
          d="M33.4697 42.9196L53.3447 31.465V16.1923L46.7197 20.0105V27.6468L33.4697 35.2832V42.9196ZM46.7197 12.3741V4.73774L53.3447 0.919556V8.55592L46.7197 12.3741Z"
          fill="#0053A4"
        />
      </svg>

      {/* Mobile version */}
      <svg
        className={`md:hidden ${className}`}
        width={32}
        height={26}
        viewBox="0 0 32 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M0.0314026 13.987L0.0314026 0.501587L11.7105 7.24431L11.7105 11.7395L3.92443 7.24431L3.92443 16.2346L0.0314026 13.987Z"
          fill="#0F82EB"
        />
        <path
          d="M11.7105 7.24431L23.3896 0.501587V13.987L15.6035 18.4822L11.7105 16.2346L19.4965 11.7395V7.24431L11.7105 11.7395L11.7105 7.24431Z"
          fill="#0053A4"
        />
        <path
          d="M11.7105 16.2346V20.7298L19.4965 25.2249L19.4965 20.7298L11.7105 16.2346Z"
          fill="#0F82EB"
        />
        <path
          d="M19.4965 25.2249L31.1756 18.4822V9.49188L27.2826 11.7395V16.2346L19.4965 20.7298L19.4965 25.2249ZM27.2826 7.24431V2.74916L31.1756 0.501587V4.99674L27.2826 7.24431Z"
          fill="#0053A4"
        />
      </svg>
    </>
  );
};

export default MaterialUIIcon;
