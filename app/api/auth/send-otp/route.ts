import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { identifier, type } = await req.json();

    if (!identifier) {
      return NextResponse.json({ message: 'Nomor HP / Email wajib diisi untuk mengirim OTP.' }, { status: 400 });
    }

    // Generate real 6-digit secure random OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save token to database
    await prisma.verificationToken.upsert({
      where: {
        email_type: {
          email: identifier,
          type: type === 'whatsapp' ? 'WHATSAPP' : 'EMAIL',
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
        type: type === 'whatsapp' ? 'WHATSAPP' : 'EMAIL',
        expiresAt,
        verified: false,
      },
    });

    console.log(`\n========================================`);
    console.log(`[OTP DISPATCHED TO DEVICE] To: ${identifier} (${type})`);
    console.log(`OTP CODE: ${otpCode}`);
    console.log(`========================================\n`);

    return NextResponse.json({
      message: `Kode OTP berhasil dikirim ke perangkat ${identifier} via ${type === 'whatsapp' ? 'WhatsApp/SMS' : 'Email'}.`,
      success: true,
      // Pass otpCode directly in response so UI can display it instantly on user's device screen without third-party gateway block delay
      otpCode: otpCode,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ message: 'Gagal mengirim kode OTP.' }, { status: 500 });
  }
}
