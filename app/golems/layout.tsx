import type { ReactNode } from 'react';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: {
    template: '%s | Golems',
    default: 'Golems',
  },
  description: 'Autonomous AI agent ecosystem for Claude Code',
};

export default function GolemsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#0c0b0a] text-[#c0b8a8] min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
