import GitHubProvider from "next-auth/providers/github"
import type { NextAuthOptions } from "next-auth"
import { isOwner } from "@/lib/auth/owner"
export { isOwner } from "@/lib/auth/owner"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return account?.provider === 'github' && isOwner({
        email: user.email,
        githubUsername: profile && 'login' in profile ? profile.login : undefined,
      })
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        if (account?.provider === 'github' && profile) {
          token.githubUsername = (profile as any).login
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id as string
        if (token.githubUsername) {
          (session.user as any).githubUsername = token.githubUsername as string
        }
      }
      return session
    },
  },
}
