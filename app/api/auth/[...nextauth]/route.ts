import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import type { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
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
      // Only allow specific GitHub users to sign in
      // You can use email, username, or user ID
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || []
      const allowedUsernames = process.env.ALLOWED_GITHUB_USERNAMES?.split(',') || []
      
      if (account?.provider === 'github') {
        // Check if user email is in allowed list
        if (allowedEmails.length > 0 && user.email && allowedEmails.includes(user.email)) {
          return true
        }
        // Check if GitHub username is in allowed list
        if (allowedUsernames.length > 0 && (profile as any)?.login && allowedUsernames.includes((profile as any).login as string)) {
          return true
        }
        // If no restrictions are set, allow all GitHub users (not recommended for production)
        if (allowedEmails.length === 0 && allowedUsernames.length === 0) {
          console.warn('No access restrictions set for GitHub OAuth. This is not recommended for production.')
          return true
        }
        return false
      }
      return false
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }