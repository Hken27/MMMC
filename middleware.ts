import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

export const middleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Admin routes protection
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!token) {
        return Response.redirect(new URL('/login?callbackUrl=/admin', req.url));
      }
      if (token.role !== 'ADMIN') {
        return Response.redirect(new URL('/', req.url));
      }
    }

    // Buyer-only routes (future: Order tracking, etc.)
    if (req.nextUrl.pathname.startsWith('/buyer')) {
      if (!token) {
        return Response.redirect(new URL('/login', req.url));
      }
      if (token.role !== 'BUYER') {
        return Response.redirect(new URL('/', req.url));
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/buyer/:path*', '/api/protected/:path*'],
};
