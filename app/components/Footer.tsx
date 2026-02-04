"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialLinks } from "./SocialLinks";

const Footer = () => {
  const pathname = usePathname();

  // Hide footer for golem admin dashboard (full-screen app)
  if (pathname?.startsWith("/admin/golem")) {
    return null;
  }

  return (
    <footer
      className="h-fit w-full space-y-10 bg-blue-800 px-4.5 py-6"
      role="contentinfo"
      aria-label="Site footer"
    >
      <nav aria-label="Footer navigation">
        <div className="flex max-h-24 w-full flex-col flex-wrap place-content-start place-items-start items-start justify-start gap-x-6 gap-y-4">
          <Link className="w-fit text-sm font-medium text-white" href="/">
            Home
          </Link>
          <Link className="w-fit text-sm font-medium text-white" href="/about">
            About
          </Link>
          <Link
            className="w-fit text-sm font-medium text-white"
            href="/contact"
          >
            Contact us
          </Link>
          <Link
            className="w-fit text-sm font-medium text-white"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="w-fit text-sm font-medium text-white"
            href="/accessibility"
          >
            Accessibility
          </Link>
        </div>
      </nav>
      <div className="flex w-full flex-col flex-wrap place-content-start place-items-start items-start justify-start gap-2">
        <div className="flex items-center justify-start gap-2">
          <SocialLinks
            className="flex items-center justify-start gap-2"
            iconContainerClassName="flex items-center justify-center p-1 rounded-full bg-blue-50 shadow-[0px_1px_1px_0px_#00004326]"
          />
        </div>
        <p className="w-fit text-sm font-medium text-white">
          All rights reserved @ 2025
        </p>
        <p className="w-fit text-sm font-medium text-white">
          Designed by{" "}
          <Link
            href="https://www.productdz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            ProductDZ
          </Link>{" "}
          | Developed by{" "}
          <Link
            href="https://www.linkedin.com/in/etanheyman"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Etan Heyman
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
