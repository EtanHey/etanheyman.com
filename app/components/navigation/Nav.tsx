"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import MenuTrigger from "./MenuTrigger";
import PopupMenu from "./PopupMenu";
import Link from "next/link";
import { SocialLinks } from "../SocialLinks";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background sticky top-0 z-10 h-full w-full px-4.5 pt-3 pb-4">
      <div className="relative flex h-15 items-center justify-between gap-3.75 rounded-[80px] bg-white px-4 py-2.5">
        <SocialLinks iconContainerClassName="flex items-center justify-center p-1 rounded-full bg-blue-50 shadow-[0px_1px_1px_0px_#00004326]" />
        <div className="flex w-full items-center justify-between gap-2">
          <Link href="/" className="flex items-center justify-center">
            <Logo />
          </Link>
          <div
            className={`flex items-center px-[6.5px] py-2.5 ${isOpen ? "bg-blue-900" : "bg-blue-500"} justify-center gap-2 rounded-full shadow-[0px_2px_1px_0px_#00004326]`}
          >
            <MenuTrigger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            <PopupMenu isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
