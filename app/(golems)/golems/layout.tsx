import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';
import Sidebar from './components/Sidebar';

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

export const metadata: Metadata = {
  title: {
    template: '%s | Golems',
    default: 'Golems — Autonomous AI Agent Ecosystem',
  },
  description: 'Autonomous AI agent ecosystem built for Claude Code. Domain-expert golems that work while you sleep.',
  icons: {
    icon: '/images/golems-logo.svg',
  },
};

export default function GolemsRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0c0b0a] text-[#c0b8a8] antialiased scrollbar-none">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}
