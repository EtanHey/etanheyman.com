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
    <nav className='w-full h-full z-10 top-0 bg-background px-4.5 pb-4 pt-3 sticky'>
      <div className='flex relative h-15 rounded-[80px] gap-3.75 items-center bg-white justify-between px-4 py-2.5'>
        <SocialLinks iconContainerClassName='flex items-center justify-center p-1 rounded-full bg-blue-50 shadow-[0px_1px_1px_0px_#00004326]' />
        <div className='flex items-center justify-between w-full gap-2'>
          <Link href='/' className='flex items-center justify-center'>
            <Logo />
          </Link>
          <div
            className={`flex items-center  px-[6.5px] py-2.5 ${isOpen ? "bg-blue-900" : "bg-blue-500"} rounded-full justify-center gap-2 shadow-[0px_2px_1px_0px_#00004326]`}>
            <MenuTrigger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            <PopupMenu isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
