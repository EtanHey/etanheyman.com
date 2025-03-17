import React, {ReactNode, useMemo} from 'react';

interface TechWrapperProps {
  children: ReactNode;
  className?: string;
}

const TechWrapper: React.FC<TechWrapperProps> = ({children, className = ''}) => {
  // Generate a random opacity value with a fixed 70% chance of full opacity
  const opacity = useMemo(() => {
    // Using a fixed 70% probability (middle of 60-80% range)
    // This ensures approximately 70% of wrappers will have full opacity
    return Math.random() < 0.7 ? 1.0 : 0.8;
  }, []);

  return (
    <div
      style={{opacity}}
      className={`
        relative bg-blue-50 flex items-center justify-center 
        w-[48.17px] h-[43.94px] rounded-tl-[338.01px] rounded-br-[338.01px] rounded-bl-[338.01px] p-[8.45px]
        md:w-[81.9px] md:h-[74.71px] md:rounded-tl-[574.71px] md:rounded-br-[574.71px] md:rounded-bl-[574.71px] md:p-[14.37px] 
        shadow-[0px_0px_34.48px_0px_hsla(209,88%,49%,1)]
        ${className}
      `}>
      {children}
    </div>
  );
};

export default TechWrapper;
