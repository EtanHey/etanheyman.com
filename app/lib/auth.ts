import GitHubProvider from "next-auth/providers/github"
import type { NextAuthOptions } from "next-auth"

export function isOwner({ email, githubUsername }: { email?: string | null; githubUsername?: unknown }): boolean {
  const allowedEmails = (process.env.ALLOWED_EMAILS || '').split(',').map(value => value.trim()).filter(Boolean)
  const allowedUsernames = (process.env.ALLOWED_GITHUB_USERNAMES || '').split(',').map(value => value.trim()).filter(Boolean)

  if (allowedEmails.length === 0 && allowedUsernames.length === 0) {
    console.error('Owner access denied: configure ALLOWED_EMAILS or ALLOWED_GITHUB_USERNAMES.')
    return false
  }
  return Boolean(
    (email && allowedEmails.includes(email)) ||
    (typeof githubUsername === 'string' && allowedUsernames.includes(githubUsername))
  )
}

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
