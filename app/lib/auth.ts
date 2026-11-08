/**
 * NextAuth Configuration
 * Spec: Phase 4.11.1 — Social Login (Google, Apple) + Email/Password
 *
 * Providers:
 * - Google OAuth 2.0
 * - Apple OAuth 2.0
 * - Credentials (Email/Password) — existing
 */

import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: false,
    }),

    // Apple OAuth
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || '',
      teamId: process.env.APPLE_TEAM_ID || '',
      keyId: process.env.APPLE_KEY_ID || '',
      privateKey: process.env.APPLE_PRIVATE_KEY || '',
      allowDangerousEmailAccountLinking: false,
    }),

    // Credentials (Email or Username + Password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Email/Username and password required');
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials.identifier }, { username: credentials.identifier }],
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials');
        }

        // Check lockout
        if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
          throw new Error('Account locked. Try again later.');
        }

        // Verify password
        const passwordMatch = await compare(credentials.password, user.passwordHash);
        if (!passwordMatch) {
          // Increment failed attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: user.failedLoginAttempts + 1,
              lockedUntil:
                user.failedLoginAttempts >= 4
                  ? new Date(Date.now() + 15 * 60 * 1000) // 15 min lockout
                  : undefined,
            },
          });
          throw new Error('Invalid credentials');
        }

        // Reset failed attempts on success
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * Handle OAuth provider signup/signin
     */
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'apple') {
        // Check if user exists
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user from OAuth
          const username = user.email?.split('@')[0] || `user_${Date.now()}`;
          existingUser = await prisma.user.create({
            data: {
              email: user.email!,
              username,
              socialProvider: account.provider === 'google' ? 'GOOGLE' : 'APPLE',
              oauthId: account.providerAccountId,
              avatar: user.image,
              emailVerified: true, // OAuth provider already verified
              verified: true,
              passwordHash: null, // No password for OAuth-only accounts
            },
          });
        } else {
          // Update existing user with OAuth info if not already linked
          if (!existingUser.socialProvider) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                socialProvider: account.provider === 'google' ? 'GOOGLE' : 'APPLE',
                oauthId: account.providerAccountId,
                avatar: user.image,
                emailVerified: true,
                verified: true,
              },
            });
          }
        }

        return true;
      }

      return true;
    },

    /**
     * JWT callback — add user role & provider info
     */
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'BUYER';
        token.socialProvider = (user as any).socialProvider || null;
      }

      if (account) {
        token.provider = account.provider;
      }

      return token;
    },

    /**
     * Session callback — pass role to client
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).provider = token.provider;
      }
      return session;
    },

    /**
     * Redirect after signin/signup
     */
    async redirect({ url, baseUrl }) {
      // Redirect based on query param or role
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === new URL(baseUrl).origin) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
