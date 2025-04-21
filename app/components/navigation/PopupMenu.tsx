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
      onClick={() => setIsOpen(false)}
      className={`absolute top-1/2 right-0 -z-10 flex w-fit flex-col gap-2 rounded-b-[40px] bg-white px-4 py-6 transition-all duration-300 ease-in-out ${isOpen ? "pointer-events-auto max-h-[500px] translate-y-0 opacity-100" : "pointer-events-none max-h-0 translate-y-[-10px] overflow-hidden px-0 py-0 opacity-0"}`}
    >
      <div className="flex min-w-21 flex-col items-center gap-4">
        <Link
          href="/"
          className={`${pathname === "/" ? "font-bold text-[#0f82eb]" : "text-[#171717]"}`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`${pathname === "/about" ? "font-bold text-[#0f82eb]" : "text-[#171717]"}`}
        >
          About
        </Link>
        <Link
          href="/projects"
          className={`${pathname.startsWith("/projects") ? "font-bold text-[#0f82eb]" : "text-[#171717]"}`}
        >
          Projects
        </Link>
        <Link
          href="/contact"
          className={`${pathname === "/contact" ? "font-bold text-[#0f82eb]" : "text-[#171717]"}`}
        >
          Contact
        </Link>
      </div>
    </div>
  );
};

export default PopupMenu;
