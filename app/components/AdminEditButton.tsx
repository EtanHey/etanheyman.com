'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface AdminEditButtonProps {
  projectId: string;
}

export default function AdminEditButton({ projectId }: AdminEditButtonProps) {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Link
      href={`/projects/${projectId}/edit`}
      className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-4 py-2"
    >
      Edit Project
    </Link>
  );
}