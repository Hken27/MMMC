import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { validateOtpFormat } from '@/app/lib/otp-service';

/**
 * POST /api/auth/verify-otp
 * Verify OTP and activate email
 *
 * Security:
 * - Generic error messages (prevent email enumeration)
 * - One-time use enforcement
 * - Expiry validation (10 minutes)
 * - No sensitive data in error messages
 */
export async function POST(req: NextRequest) {
  try {
    const { identifier, code } = await req.json();

    // Generic validation response
    if (!identifier || !code) {
      return NextResponse.json(
        { message: 'Please check your verification code and try again.' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!validateOtpFormat(code)) {
      return NextResponse.json(
        { message: 'Invalid verification code format. Please try again.' },
        { status: 400 }
      );
    }

    // Find valid unexpired verification token
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        email: identifier,
        code,
        type: 'EMAIL',
        verified: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!tokenRecord) {
      // Generic message - don't reveal if email exists or code is wrong
      return NextResponse.json(
        { message: 'Verification code is invalid or has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Mark token as verified (one-time use enforcement)
    await prisma.verificationToken.update({
      where: { id: tokenRecord.id },
      data: { verified: true },
    });

    // Update user account status
    const updatedUser = await prisma.user.update({
      where: { email: identifier },
      data: {
        verified: true,
        emailVerified: true
      },
    }).catch(() => null);

    if (!updatedUser) {
      console.error('[Verify OTP] User not found after token verification', {
        email: identifier.substring(0, 3) + '***',
      });
      return NextResponse.json(
        { message: 'An error occurred. Please contact support.' },
        { status: 500 }
      );
    }

    // Log successful verification (masked data only)
    console.log('[OTP Verification Success]', {
      email: identifier.substring(0, 3) + '***@***',
      userId: updatedUser.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Email verified successfully. Your account is now active.',
      success: true,
      username: updatedUser.username || 'buyer',
    });
  } catch (error) {
    console.error('[Verify OTP Error]', {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      { message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
