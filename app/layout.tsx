import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import Footer from "./components/Footer";
import {
  BottomMobileBgCover,
  TopMobileBgCover,
} from "./components/navigation/mobileBgCover";
import Nav from "./components/navigation/Nav";

export const metadata: Metadata = {
  title: "Etan Heyman",
  description:
    "Personal website of Etan Heyman | UI/UX Design by Dor Zohar (ProductDZ)",
  keywords: [
    "developer",
    "portfolio",
    "software engineer",
    "Dor Zohar",
    "ProductDZ",
    "UI/UX design",
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
      "Personal website of Etan Heyman | UI/UX Design by Dor Zohar (ProductDZ)",
    siteName: "Etan Heyman's Portfolio | Full-Stack Developer",
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
      "Personal website of Etan Heyman | UI/UX Design by Dor Zohar (ProductDZ)",
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
    <html lang="en">
      <body
        className={`relative -z-20 flex h-full min-h-screen flex-col justify-center overscroll-none antialiased *:text-white`}
      >
        {/* Top SVGs (fixed to viewport) */}
        <Nav />
        {/* Main content */}
        <div className="bg-background relative z-0 flex h-full grow flex-col items-center justify-center overflow-hidden">
          <TopMobileBgCover />
          <BottomMobileBgCover />
          {children}
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
