import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/app/lib/prisma';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Facebook from 'next-auth/providers/facebook';

export const { handlers, signIn, signOut, auth } = NextAuth({
  // debug: true, // uncomment for debugging
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Facebook({ allowDangerousEmailAccountLinking: true }),
  ],
  callbacks: {
    // 1. JWT CALLBACK - This runs first on login
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store ID in the token
      }
      return token;
    },
    // 2. SESSION CALLBACK - Exposes token data to the client
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // 3. AUTHORIZED CALLBACK - Protecting Routes
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/jobs') ||
        nextUrl.pathname.startsWith('/logs') ||
        nextUrl.pathname.startsWith('/contact');

      if (isProtectedRoute) {
        return isLoggedIn; // Returns true if logged in, otherwise redirects to login
      }
      return true;
    },
  },
});
