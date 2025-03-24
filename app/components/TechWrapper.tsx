import React, {ReactNode, useMemo, useState} from 'react';

interface TechWrapperProps {
  children: ReactNode;
  className?: string;
  name?: string; // Add name prop to create deterministic opacity
}

const TechWrapper: React.FC<TechWrapperProps> = ({children, className = '', name = ''}) => {
  // Generate a deterministic opacity value based on the component name
  // This ensures server and client rendering match
  const nameOpacity = useMemo(() => {
    if (!name) return 0.8; // Default opacity for unnamed items
    
    // Use a deterministic approach based on name
    // Sum the character codes of the name and use modulo for determinism
    const nameSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return nameSum % 2 === 0 ? 0.8 : 1;
  }, [name]);

  const [opacity, setOpacity] = useState(nameOpacity);

  return (
    <div
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(nameOpacity)}
      style={{opacity}}
      className={`
          relative bg-blue-50 flex opacity-80 hover:opacity-100 transition-opacity duration-300 items-center justify-center 
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
