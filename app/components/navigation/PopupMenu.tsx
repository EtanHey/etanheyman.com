import Link from "next/link";
import { usePathname } from "next/navigation";

const PopupMenu = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const pathname = usePathname();

  return (
    <div
      className={`absolute right-4 top-[72px] z-50 flex w-fit flex-col gap-2 rounded-[24px] bg-white px-6 py-5 shadow-[0px_8px_32px_rgba(0,0,63,0.25)] transition-all duration-300 ease-in-out ${isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
    >
      <div className="flex min-w-[120px] flex-col items-center gap-4">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className={`text-[16px] font-medium transition-colors ${pathname === "/" ? "font-bold text-[#0f82eb]" : "text-[#171717] hover:text-[#0f82eb]"}`}
        >
          Home
        </Link>
        <Link
          href="/projects"
          onClick={() => setIsOpen(false)}
          className={`text-[16px] font-medium transition-colors ${pathname === "/projects" ? "font-bold text-[#0f82eb]" : "text-[#171717] hover:text-[#0f82eb]"}`}
        >
          Projects
        </Link>
        <Link
          href="/about"
          onClick={() => setIsOpen(false)}
          className={`text-[16px] font-medium transition-colors ${pathname === "/about" ? "font-bold text-[#0f82eb]" : "text-[#171717] hover:text-[#0f82eb]"}`}
        >
          About
        </Link>
        <Link
          href="/contact"
          onClick={() => setIsOpen(false)}
          className={`text-[16px] font-medium transition-colors ${pathname === "/contact" ? "font-bold text-[#0f82eb]" : "text-[#171717] hover:text-[#0f82eb]"}`}
        >
          Contact
        </Link>
      </div>
    </div>
  );
};

export default PopupMenu;
