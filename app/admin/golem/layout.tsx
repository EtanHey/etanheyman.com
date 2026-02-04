'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Bell, Moon, FileText, ArrowLeft, Bot } from 'lucide-react';
import { useEffect } from 'react';

const navItems = [
  { href: '/admin/golem/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/golem/alerts', label: 'Alerts', icon: Bell },
  { href: '/admin/golem/nightshift', label: 'Night Shift', icon: Moon },
  { href: '/admin/golem/content', label: 'Content', icon: FileText },
];

export default function GolemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Middleware handles auth - this is a fallback for client-side navigation
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#00003f]">
        <div className="text-white/60">Authenticating...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#00003f] text-white">
      {/* Header */}
      <header className="shrink-0 border-b border-white/10 bg-blue-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Admin
              </Link>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold">ClaudeGolem</span>
              </div>
            </div>
            <span className="text-sm text-white/40">
              @{(session?.user as any)?.githubUsername || 'unknown'}
            </span>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="shrink-0 border-b border-white/10 bg-blue-900/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content - fills remaining space */}
      <main className="flex-1 overflow-hidden">
        <div className="mx-auto h-full max-w-7xl px-4 py-4">
          {children}
        </div>
      </main>
    </div>
  );
}
