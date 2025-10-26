"use client";

import Link from "next/link";
import {
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "./navigation/socialIcons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useRegion } from "../hooks/useRegion";

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
  const { contactInfo, isLoading } = useRegion();

  const socialLinks = [
    {
      href: `https://wa.me/${contactInfo.whatsapp}`,
      icon: <WhatsappIcon />,
      label: "WhatsApp",
      isRegionDependent: true,
    },
    {
      href: "https://www.facebook.com/etanheyman",
      icon: <FacebookIcon />,
      label: "Facebook",
      isRegionDependent: false,
    },
    {
      href: "https://www.linkedin.com/in/etanheyman",
      icon: <LinkedinIcon />,
      label: "LinkedIn",
      isRegionDependent: false,
    },
    {
      href: "https://github.com/etanhey",
      icon: <GithubIcon />,
      label: "GitHub",
      isRegionDependent: false,
    },
  ];

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        {socialLinks
          .filter((link) => !link.isRegionDependent || !isLoading)
          .map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
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
