import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { requireOwner } from "@/lib/auth/require-owner";

export default async function AddProjectLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (await requireOwner()) return children;

  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/unauthorized");
  redirect(`/admin?callbackUrl=${encodeURIComponent("/projects/add")}`);
}
