import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';
import { checkRateLimit, recordFailedAttempt, resetFailedAttempts } from '@/app/lib/rate-limit';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      username?: string | null;
      image?: string | null;
      role?: string;
      verified?: boolean;
      mustChangePassword?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username?: string;
    role?: string;
    verified?: boolean;
    mustChangePassword?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username/Email dan password wajib diisi.');
        }

        const loginKey = credentials.username.trim();

        // Check rate limiting / lockout
        const rateLimit = await checkRateLimit(loginKey);
        if (!rateLimit.allowed) {
          throw new Error(rateLimit.message || 'Akun terkunci karena terlalu banyak percobaan login.');
        }

        // Support login by Username OR Email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: loginKey },
              { email: loginKey },
            ],
          },
        });

        if (!user) {
          throw new Error('Akun dengan username atau email tersebut tidak ditemukan.');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          const failRecord = await recordFailedAttempt(user.username);
          throw new Error(failRecord.message || 'Password salah.');
        }

        // Reset failed attempts on success
        await resetFailedAttempts(user.username);

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          verified: user.verified,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
        token.verified = (user as any).verified;
        token.mustChangePassword = (user as any).mustChangePassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
        (session.user as any).verified = token.verified;
        (session.user as any).mustChangePassword = token.mustChangePassword;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=auth',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    maxAge: 24 * 60 * 60,
  },
};
