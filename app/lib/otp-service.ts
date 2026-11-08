/**
 * OTP Sender - Real Email Delivery via Resend API
 * Spec: Phase 4.2 Real OTP API Dispatch (Email)
 *
 * Security Requirements:
 * - Cryptographically secure OTP generation
 * - No plaintext OTP exposure in logs/console
 * - Rate limiting on send/verify operations
 * - Generic error messages (no email enumeration)
 * - Environment variables for sensitive data
 */

import { Resend } from 'resend';
import { getOtpVerificationEmailTemplate } from './email-templates';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@resend.dev';

/**
 * Send real OTP via Resend API
 * Returns generic response for security (no email enumeration)
 */
export async function sendOtpEmail(email: string, otpCode: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    // Validate email format
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Please check your email and try again.',
        error: 'INVALID_EMAIL',
      };
    }

    // Validate OTP format (6 digits)
    if (!otpCode || !/^\d{6}$/.test(otpCode)) {
      console.error('[OTP] Invalid OTP format:', { otpLength: otpCode?.length });
      return {
        success: false,
        message: 'An error occurred. Please try again.',
        error: 'INVALID_OTP_FORMAT',
      };
    }

    // Get email template
    const template = getOtpVerificationEmailTemplate(otpCode);

    // Send via Resend API
    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      reply_to: 'support@cmmm.com',
    });

    // Check for Resend API errors
    if (response.error) {
      console.error('[Resend API Error] Detailed:', {
        message: response.error.message,
        type: response.error.type,
        email: email.substring(0, 3) + '***',
        fullError: JSON.stringify(response.error),
      });

      // Generic error message to prevent email enumeration
      return {
        success: false,
        message: 'An error occurred sending verification code. Please try again.',
        error: response.error.type,
      };
    }

    // Success - log only masked email and message ID
    console.log('[Resend API Success]', {
      messageId: response.data?.id,
      email: email.substring(0, 3) + '***@***', // Masked for security
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Verification code sent to your email. Please check your inbox.',
    };
  } catch (error) {
    console.error('[OTP Send Error]', {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      // Do NOT log the actual error message or email
      timestamp: new Date().toISOString(),
    });

    // Generic error response
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
      error: 'SEND_ERROR',
    };
  }
}

/**
 * Validate OTP is 6 digits (for verify endpoint)
 */
export function validateOtpFormat(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Generate secure 6-digit OTP
 * Uses crypto.randomInt for cryptographic security
 */
export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}
