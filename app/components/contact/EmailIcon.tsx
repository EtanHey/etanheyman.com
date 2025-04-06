import React from "react";

interface EmailIconProps {
  className?: string;
  color?: string;
  size?: number;
  ariaLabel?: string;
}

export const EmailIcon: React.FC<EmailIconProps> = ({ className = "", color = "currentColor", size = 24, ariaLabel = "Email" }) => {
  return (
    <svg
      width={size}
      height={size * 0.833}
      viewBox='0 0 24 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-label={ariaLabel}
      role='img'>
      <path
        d='M20 0H4C1.33333 0 0 1.33333 0 4V16C0 18.6667 1.33333 20 4 20H20C22.6667 20 24 18.6667 24 16V4C24 1.33333 22.6667 0 20 0ZM19.9212 6.14134L13.3721 10.904C12.9614 11.2027 12.48 11.352 12 11.352C11.52 11.352 11.0373 11.2027 10.6279 10.9053L4.07878 6.14134C3.63211 5.81734 3.53339 5.19067 3.85872 4.744C4.18272 4.29867 4.80519 4.19734 5.25586 4.52401L11.8053 9.28666C11.9227 9.37066 12.0786 9.37199 12.196 9.28666L18.7454 4.52401C19.1948 4.19734 19.8186 4.29867 20.1426 4.744C20.4679 5.192 20.3679 5.81734 19.9212 6.14134Z'
        fill={color}
      />
    </svg>
  );
};
