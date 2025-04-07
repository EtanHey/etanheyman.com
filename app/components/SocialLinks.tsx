"use client";

import Link from "next/link";
import { FacebookIcon, GithubIcon, LinkedinIcon, WhatsappIcon } from "./navigation/socialIcons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

type SocialLinksProps = {
  className?: string;
  linkClassName?: string;
  iconContainerClassName?: string;
};

export function SocialLinks({
  className = "",
  linkClassName = "",
  iconContainerClassName = "flex items-center justify-center p-1 rounded-full bg-blue-50",
}: SocialLinksProps) {
  const socialLinks = [
    {
      href: "https://wa.me/+17179629684",
      icon: <WhatsappIcon />,
      label: "WhatsApp",
    },
    {
      href: "https://www.facebook.com/etanheyman",
      icon: <FacebookIcon />,
      label: "Facebook",
    },
    {
      href: "https://www.linkedin.com/in/etanheyman",
      icon: <LinkedinIcon />,
      label: "LinkedIn",
    },
    {
      href: "https://github.com/etanhey",
      icon: <GithubIcon />,
      label: "GitHub",
    },
  ];

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        {socialLinks.map((link) => (
          <Tooltip key={link.href}>
            <TooltipTrigger asChild>
              <Link href={link.href} target='_blank' rel='noopener noreferrer' className={linkClassName}>
                <div className={iconContainerClassName}>{link.icon}</div>
              </Link>
            </TooltipTrigger>
            <TooltipContent>{link.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
