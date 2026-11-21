import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Young_Serif, IBM_Plex_Sans, IBM_Plex_Mono, Frank_Ruhl_Libre } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { getDocsNav } from './lib/docs-nav';

// AIDEV-NOTE: Golems type system. Young Serif (display) is a sturdy, hand-formed
// serif that reads like stamped clay; IBM Plex Sans/Mono carry body and code;
// Frank Ruhl Libre renders the Hebrew "emet" inscription in the hero.
const display = Young_Serif({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-golems-display',
  display: 'swap',
});

const sans = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-golems-sans',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-golems-mono',
  display: 'swap',
});

const hebrew = Frank_Ruhl_Libre({
  weight: ['900'],
  subsets: ['hebrew'],
  variable: '--font-golems-hebrew',
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
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${hebrew.variable}`}
    >
      <body className="bg-g-slip font-g-sans text-g-ink antialiased">
        <a
          href="#golems-main"
          className="sr-only z-[60] rounded-md bg-g-cobalt px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Header nav={nav} />
        <div className="flex min-h-[calc(100vh-3.5rem)]">
          <Sidebar nav={nav} />
          <main id="golems-main" tabIndex={-1} className="min-w-0 flex-1 overflow-x-clip focus:outline-none">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
