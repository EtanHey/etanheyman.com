'use client';

import { FileText, Construction } from 'lucide-react';

export default function ContentPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-white/5 p-4 mb-4">
        <FileText className="h-12 w-12 text-white/40" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Content</h2>
      <p className="text-white/60 mb-4">Manage Soltome drafts and posts</p>
      <div className="flex items-center gap-2 text-amber-400 text-sm">
        <Construction className="h-4 w-4" />
        Coming soon
      </div>
    </div>
  );
}
