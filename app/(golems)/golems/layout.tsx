import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { JetBrains_Mono, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { getDocsNav, type DocNavItem } from './lib/docs-nav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-golems-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-golems-mono',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Golems',
    default: 'Golems — AI-Agent Packages, CLI Tooling and Evaluated Skills',
  },
  description: 'Golems is a Bun monorepo of AI-agent packages, command-line tooling, and evaluated workflow skills for Claude Code and other AI coding agents. Public source on GitHub.',
  icons: {
    icon: '/images/golems-logo.svg',
  },
};

export default function GolemsRootLayout({ children }: { children: ReactNode }) {
  const nav = getDocsNav();

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-[#0c0b0a] text-[#c0b8a8] antialiased scrollbar-none">
        <Header nav={nav} />
        <div className="flex min-h-screen">
          <Sidebar nav={nav} />
          <main className="flex-1 min-w-0 overflow-x-clip">{children}</main>
        </div>
      </body>
    </html>
  );
}
