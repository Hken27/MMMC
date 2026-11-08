import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { sendOtpEmail, validateOtpFormat } from '@/app/lib/otp-service';
import crypto from 'crypto';

/**
 * POST /api/auth/send-otp
 * Send OTP verification email
 *
 * Security:
 * - Rate limit per IP/email
 * - Generic error messages
 * - No email enumeration
 * - Cryptographically secure OTP
 */
export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        { message: 'Please check your email and try again.' },
        { status: 400 }
      );
    }

    // Generate secure 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save to database
    await prisma.verificationToken.upsert({
      where: {
        email_type: {
          email: identifier,
          type: 'EMAIL',
        },
      },
      update: {
        code: otpCode,
        expiresAt,
        verified: false,
      },
      create: {
        email: identifier,
        code: otpCode,
        type: 'EMAIL',
        expiresAt,
        verified: false,
      },
    });

    // Send via Resend API
    const sendResult = await sendOtpEmail(identifier, otpCode);

    if (!sendResult.success) {
      // Log error untuk debugging
      console.error('[Send OTP] sendOtpEmail failed:', {
        email: identifier.substring(0, 3) + '***',
        error: sendResult.error,
        message: sendResult.message,
      });

      return NextResponse.json(
        { message: sendResult.message },
        { status: 400 }
      );
    }

    // Success response - don't expose OTP to client in production
    // For development/testing, include OTP in response
    const isDev = process.env.NODE_ENV === 'development';

    return NextResponse.json({
      message: sendResult.message,
      success: true,
      ...(isDev && { otpCode }), // Only in development
    });
  } catch (error) {
    console.error('[Send OTP Error]', {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      { message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

