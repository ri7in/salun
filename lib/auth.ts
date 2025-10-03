import NextAuth, { DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { getUserByEmail, createUser, updateUser } from './supabase';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: 'client' | 'staff' | 'admin';
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'client' | 'staff' | 'admin';
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) {
          return false;
        }

        // Check if user exists in our database
        let dbUser = await getUserByEmail(user.email);

        if (!dbUser) {
          // Create new user
          dbUser = await createUser(
            user.email,
            user.name || user.email.split('@')[0],
            user.image || undefined
          );

          // Make first user with ADMIN_EMAIL an admin
          if (user.email === process.env.ADMIN_EMAIL && dbUser) {
            await updateUser(dbUser.id, { role: 'admin' });
          }
        } else {
          // Update user image if changed
          if (user.image && user.image !== dbUser.image) {
            await updateUser(dbUser.id, { image: user.image });
          }
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const dbUser = await getUserByEmail(session.user.email!);
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
