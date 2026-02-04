'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, Plus, Home, Bot } from 'lucide-react';

export default function AdminFloatingMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!session) return null;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <>
      {/* Floating Admin Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all hover:bg-purple-700 hover:scale-110"
        aria-label="Admin menu"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="fixed bottom-20 right-4 z-50 w-56 overflow-hidden rounded-lg bg-gray-900 shadow-xl border border-gray-800">
            <div className="p-3 border-b border-gray-800">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-medium text-white">{session.user?.name}</p>
            </div>
            
            <div className="p-2">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded px-3 py-2 text-sm text-white transition-colors hover:bg-gray-800"
              >
                <Home className="h-4 w-4" />
                Admin Dashboard
              </Link>

              <Link
                href="/admin/golem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded px-3 py-2 text-sm text-emerald-400 transition-colors hover:bg-gray-800"
              >
                <Bot className="h-4 w-4" />
                ClaudeGolem
              </Link>

              <Link
                href="/projects/add"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded px-3 py-2 text-sm text-white transition-colors hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-red-400 transition-colors hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}