'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GolemPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to jobs by default
    router.replace('/admin/golem/jobs');
  }, [router]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-white/60">Redirecting to Jobs...</div>
    </div>
  );
}
