import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/app/lib/prisma';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Facebook from 'next-auth/providers/facebook';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // MUST USE JWT so the proxy.ts can read the session without crashing
  session: { strategy: 'jwt' },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Facebook({ allowDangerousEmailAccountLinking: true }),
  ],
  callbacks: {
    // THIS IS THE REDIRECT LOGIC
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith('/cronlabs');
      // nextUrl.pathname.startsWith('/cronlabs') || nextUrl.pathname.startsWith('/protected');

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // This triggers the redirect to sign-in
      }
      return true;
    },
    async session({ session, token }) {
      // Note: When using JWT strategy, use 'token' instead of 'user'
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
