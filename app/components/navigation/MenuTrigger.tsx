import React from 'react';

interface MenuTriggerProps {
  width?: number;
  height?: number;
  className?: string;
  isOpen?: boolean;
  onClick?: () => void;
}

const MenuTrigger: React.FC<MenuTriggerProps> = ({width = 23, height = 16, className = '', onClick, isOpen = false}) => {
  return (
    <button className='flex items-center cursor-pointer justify-center' onClick={onClick}>
      {!isOpen ? (
        <svg width={width} height={height} viewBox='0 0 24 16' fill='none' xmlns='http://www.w3.org/2000/svg' onClick={onClick} className={className}>
          <path d='M22.6154 1.77778H9.64103C9.15272 1.77778 8.75641 1.37956 8.75641 0.888889C8.75641 0.398222 9.15272 0 9.64103 0H22.6154C23.1037 0 23.5 0.398222 23.5 0.888889C23.5 1.37956 23.1037 1.77778 22.6154 1.77778ZM23.5 8C23.5 7.50933 23.1037 7.11111 22.6154 7.11111H1.38462C0.896308 7.11111 0.5 7.50933 0.5 8C0.5 8.49067 0.896308 8.88889 1.38462 8.88889H22.6154C23.1037 8.88889 23.5 8.49067 23.5 8ZM15.2436 15.1111C15.2436 14.6204 14.8473 14.2222 14.359 14.2222H1.38462C0.896308 14.2222 0.5 14.6204 0.5 15.1111C0.5 15.6018 0.896308 16 1.38462 16H14.359C14.8473 16 15.2436 15.6018 15.2436 15.1111Z' fill='white' />
        </svg>
      ) : (
        <svg width={width} height={height} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' onClick={onClick} className={className}>
          <path d='M15.7369 14.482C16.0842 14.8292 16.0842 15.3921 15.7369 15.7393C15.5639 15.9123 15.3364 16 15.1089 16C14.8813 16 14.6538 15.9135 14.4808 15.7393L7.99868 9.25716L1.51654 15.7393C1.34353 15.9123 1.116 16 0.888477 16C0.660951 16 0.433426 15.9135 0.260411 15.7393C-0.0868037 15.3921 -0.0868037 14.8292 0.260411 14.482L6.74254 7.99987L0.260411 1.51777C-0.0868037 1.17056 -0.0868037 0.607626 0.260411 0.260411C0.607626 -0.0868037 1.17052 -0.0868037 1.51774 0.260411L7.99987 6.74258L14.482 0.260411C14.8292 -0.0868037 15.3921 -0.0868037 15.7393 0.260411C16.0865 0.607626 16.0865 1.17056 15.7393 1.51777L9.25718 7.99987L15.7369 14.482Z' fill='white' />
        </svg>
      )}
    </button>
  );
};

export default MenuTrigger;
