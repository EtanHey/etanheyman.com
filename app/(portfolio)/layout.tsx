import type { Metadata } from "next";
import localFont from "next/font/local";
import { Source_Serif_4 } from "next/font/google";
// Order matters: portfolio-type.css must declare its cascade layer before globals.css.
import "./portfolio-type.css";
import "../globals.css";
import "./portfolio.css";

import { Toaster } from "@/components/ui/sonner";
import SiteFooter from "./_components/SiteFooter";
import SiteNav from "./_components/SiteNav";

// Configure Nutmeg font for headers (purchased web fonts)
const nutmeg = localFont({
  src: [
    {
      path: "../../fonts/nutmeg/nutmeg-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/nutmeg/nutmeg-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/nutmeg/nutmeg-book.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/nutmeg/nutmeg-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nutmeg",
  display: "swap",
});

// Prose face for descriptions and long text; Nutmeg stays the display and UI voice.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-pf-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Etan Heyman — AI Engineer",
  description:
    "AI engineer building open-source tools for AI coding agents: persistent memory, voice I/O and parallel agent orchestration over MCP, plus the Golems skills and their evals.",
  keywords: [
    "AI engineer",
    "MCP server",
    "AI agents",
    "open source",
    "developer",
    "portfolio",
  ],
  authors: [
    { name: "Etan Heyman" },
    { name: "Dor Zohar", url: "https://www.productdz.com" },
  ],
  creator: "Etan Heyman",
  publisher: "Etan Heyman",
  metadataBase: new URL("https://etanheyman.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
    other: [{ rel: "manifest", url: "/favicon/site.webmanifest" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://etanheyman.com",
    title: "Etan Heyman",
    description:
      "AI engineer building open-source tools for AI coding agents: memory, voice, orchestration and skills.",
    siteName: "Etan Heyman | AI Engineer",
    images: [
      {
        url: "/favicon/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "Etan Heyman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Etan Heyman",
    description:
      "AI engineer building open-source tools for AI coding agents: memory, voice, orchestration and skills.",
    images: ["/favicon/web-app-manifest-512x512.png"],
  },
  verification: {
    other: {
      designer: "https://www.productdz.com",
      "designer-linkedin": "https://www.linkedin.com/in/productdz/",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden scroll-smooth">
      <body
        className={`${nutmeg.variable} ${sourceSerif.variable} pf-root flex min-h-screen flex-col antialiased`}
      >
        <SiteNav />
        <div id="main" tabIndex={-1} className="flex grow flex-col outline-none">
          {children}
        </div>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
