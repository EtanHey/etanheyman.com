"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import MenuTrigger from "./MenuTrigger";
import PopupMenu from "./PopupMenu";
import Link from "next/link";
import { SocialLinks } from "../SocialLinks";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Hide nav for golem admin dashboard (has its own nav)
  if (pathname?.startsWith("/admin/golem")) {
    return null;
  }

  return (
    <nav className="bg-background sticky top-0 z-10 h-full w-full px-4.5 pt-3 pb-4">
      <div className="relative flex h-15 items-center justify-between gap-3.75 rounded-[80px] bg-white px-4 py-2.5">
        <SocialLinks iconContainerClassName="flex items-center justify-center p-1 rounded-full bg-blue-50 shadow-[0px_1px_1px_0px_#00004326]" />
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Logo />
        </Link>
        <div
          className={`flex items-center px-[6.5px] py-2.5 ${isOpen ? "bg-blue-900" : "bg-blue-500"} justify-center gap-2 rounded-full shadow-[0px_2px_1px_0px_#00004326]`}
        >
          <MenuTrigger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </div>
      </div>
      {/* Backdrop overlay to close menu on tap outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <PopupMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </nav>
  );
};

export default Nav;
