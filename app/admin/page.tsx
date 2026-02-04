'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Github, Bot, Briefcase, Bell, Moon, FileText } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/' });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/70 mt-2">Welcome, {session.user?.name}</p>
            <p className="text-white/50 text-sm">@{(session.user as any)?.githubUsername || 'N/A'}</p>
          </div>

          {/* ClaudeGolem Dashboard */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Bot className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">ClaudeGolem</h2>
                <p className="text-sm text-white/60">Autonomous agent dashboard</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/golem/jobs"
                className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Briefcase className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">Jobs</span>
              </Link>
              <Link
                href="/admin/golem/alerts"
                className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Bell className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-white">Alerts</span>
              </Link>
              <Link
                href="/admin/golem/nightshift"
                className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Moon className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white">Night Shift</span>
              </Link>
              <Link
                href="/admin/golem/content"
                className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <FileText className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white">Content</span>
              </Link>
            </div>
          </div>

          {/* Account actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 text-white transition-colors hover:bg-white/10"
            >
              Back to Home
            </button>
            <button
              onClick={() => signOut()}
              className="w-full rounded-full bg-red-500/20 border border-red-500/30 px-6 py-3 text-red-400 transition-colors hover:bg-red-500/30"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-white/60 text-sm">Sign in with your authorized GitHub account</p>
        </div>
        
        <button
          onClick={handleGitHubSignIn}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-white text-black px-6 py-3 font-medium transition-all hover:bg-gray-100"
        >
          <Github className="h-5 w-5" />
          Sign in with GitHub
        </button>
        
        <p className="text-center text-xs text-white/40">
          Only authorized GitHub accounts can access the admin area
        </p>
      </div>
    </div>
  );
}