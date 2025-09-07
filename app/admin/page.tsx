'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';

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
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/70">You are logged in as {session.user?.name}</p>
          <p className="text-white/50 text-sm">GitHub: @{session.user?.githubUsername || 'N/A'}</p>
          <button
            onClick={() => signOut()}
            className="w-full rounded-full bg-red-500 px-6 py-3 text-white transition-colors hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 text-white transition-colors hover:bg-white/10"
          >
            Back to Home
          </button>
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