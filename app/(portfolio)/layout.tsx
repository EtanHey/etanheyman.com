import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

import { Toaster } from "@/components/ui/sonner";
import Footer from "@/app/components/Footer";
import {
  BottomMobileBgCover,
  TopMobileBgCover,
} from "@/app/components/navigation/mobileBgCover";
import Nav from "@/app/components/navigation/Nav";
import AuthSessionProvider from "@/app/providers/SessionProvider";
import AdminFloatingMenu from "@/app/components/AdminFloatingMenu";

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

export const metadata: Metadata = {
  title: "Etan Heyman — AI Engineer",
  description:
    "Building open-source tools for AI agents. Creator of Golems: 3 MCP servers, 44 tools — persistent memory, voice I/O, multi-agent orchestration.",
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
      "AI Engineer building open-source tools for AI agents. Creator of the Golems ecosystem: 3 MCP servers, 44 tools.",
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
      "AI Engineer building open-source tools for AI agents. Creator of the Golems ecosystem: 3 MCP servers, 44 tools.",
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
        className={`${nutmeg.variable} relative -z-20 flex h-full min-h-screen flex-col justify-center overscroll-none antialiased *:text-white`}
      >
        <AuthSessionProvider>
          {/* Top SVGs (fixed to viewport) */}
          <Nav />
          {/* Main content */}
          <div className="bg-background relative z-0 flex h-full grow flex-col items-center justify-center">
            <TopMobileBgCover />
            <BottomMobileBgCover />
            {children}
          </div>
          <Footer />
          <Toaster />
          <AdminFloatingMenu />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
