import React from 'react';

export interface TechIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
  title?: string;
  onClick?: () => void;
}

export const TechIcon: React.FC<TechIconProps & {children: React.ReactNode}> = ({width = 47, height = 47, className = '', title, onClick, children}) => {
  return (
    <svg width={width} height={height} viewBox='0 0 47 47' fill='none' xmlns='http://www.w3.org/2000/svg' className={className} onClick={onClick} role='img' aria-labelledby={title ? 'title' : undefined}>
      {title && <title id='title'>{title}</title>}
      {children}
    </svg>
  );
};

export default TechIcon;
