import React from "react";
import { TechIconProps } from "./TechIcon";

const InkIcon: React.FC<TechIconProps> = ({ className = "", ...props }) => {
  const p = 3;
  const g = 0.4;
  const s = p + g;
  const c = "#0053A4";

  // Pixel grid matching the Ink logo structure — monochrome blue
  const pixels: [number, number][] = [
    // I (col 0): full height
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    // N (cols 2-5): left col + diagonal + right col
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [2, 7],
    [3, 0],
    [3, 1],
    [3, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [5, 5],
    [5, 6],
    [5, 7],
    // K (cols 7-9): left col + upper arm + lower arm
    [7, 0],
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6],
    [7, 7],
    [8, 1],
    [8, 2],
    [8, 5],
    [8, 6],
    [9, 0],
    [9, 7],
  ];

  const svgContent = pixels.map(([col, row]) => (
    <rect
      key={`${col}-${row}`}
      x={col * s}
      y={row * s}
      width={p}
      height={p}
      fill={c}
    />
  ));

  const width = 10 * s + p;
  const height = 8 * s + p;

  return (
    <>
      <svg
        className={`hidden sm:block ${className}`}
        width={47}
        height={47}
        viewBox={`-1 -1 ${width + 2} ${height + 2}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {svgContent}
      </svg>

      <svg
        className={`sm:hidden ${className}`}
        width={28}
        height={28}
        viewBox={`-1 -1 ${width + 2} ${height + 2}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {svgContent}
      </svg>
    </>
  );
};

export default InkIcon;
