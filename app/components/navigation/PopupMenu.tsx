import Link from 'next/link';
import {usePathname} from 'next/navigation';

const PopupMenu = ({isOpen, setIsOpen}: {isOpen: boolean; setIsOpen: (isOpen: boolean) => void}) => {
  const pathname = usePathname();

  return (
    <div
      onClick={() => setIsOpen(false)}
      className={`absolute top-1/2 right-0 w-fit -z-10 bg-white rounded-b-[40px] px-4 py-6 flex flex-col gap-2 
        transition-all duration-300 ease-in-out 
        ${isOpen ? 'max-h-[500px] opacity-100 pointer-events-auto translate-y-0' : 'max-h-0 opacity-0 pointer-events-none translate-y-[-10px] overflow-hidden py-0 px-0'}`}>
      <div className='flex flex-col min-w-21 items-center gap-4'>
        <Link href='/' className={`${pathname === '/' ? 'text-[#0f82eb] font-bold' : 'text-[#171717]'}`}>
          Home
        </Link>
        <Link href='/about' className={`${pathname === '/about' ? 'text-[#0f82eb] font-bold' : 'text-[#171717]'}`}>
          About
        </Link>
        <Link href='/contact' className={`${pathname === '/contact' ? 'text-[#0f82eb] font-bold' : 'text-[#171717]'}`}>
          Contact
        </Link>
      </div>
    </div>
  );
};

export default PopupMenu;
