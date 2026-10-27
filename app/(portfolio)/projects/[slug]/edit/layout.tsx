import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { requireOwner } from "@/lib/auth/require-owner";

export default async function EditProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  if (await requireOwner()) return children;

  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/unauthorized");
  const { slug } = await params;
  const callbackUrl = `/projects/${encodeURIComponent(slug)}/edit`;
  redirect(`/admin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}
