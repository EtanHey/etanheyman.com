import React from "react";

interface LocationIconProps {
  className?: string;
  color?: string;
  size?: number;
  ariaLabel?: string;
}

export const LocationIcon: React.FC<LocationIconProps> = ({
  className = "",
  color = "currentColor",
  size = 24,
  ariaLabel = "Location",
}) => {
  return (
    <svg
      width={size * 0.833}
      height={size}
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={ariaLabel}
      role="img"
    >
      <path
        d="M19.5 20C19.5 22.2093 15.2467 24 10 24C4.75329 24 0.5 22.2093 0.5 20C0.5 17.936 4.2145 16.2374 8.98214 16.0241V18.6667C8.98214 19.2133 9.44357 19.6667 10 19.6667C10.5564 19.6667 11.0179 19.2133 11.0179 18.6667V16.0241C15.7855 16.2374 19.5 17.936 19.5 20ZM11.0179 16.0241V10.5654C13.5286 10.0961 15.4286 7.936 15.4286 5.33333C15.4286 2.388 12.9979 0 10 0C7.00207 0 4.57143 2.388 4.57143 5.33333C4.57143 7.936 6.47143 10.0974 8.98214 10.5654V16.0241C9.31736 16.0094 9.65529 16 10 16C10.3447 16 10.6826 16.0094 11.0179 16.0241Z"
        fill={color}
      />
    </svg>
  );
};
