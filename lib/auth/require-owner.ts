import { getServerSession } from "next-auth";
import { authOptions, isOwner } from "@/app/lib/auth";

export async function requireOwner(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;
  return isOwner({
    email: session.user.email,
    githubUsername:
      "githubUsername" in session.user
        ? session.user.githubUsername
        : undefined,
  });
}
