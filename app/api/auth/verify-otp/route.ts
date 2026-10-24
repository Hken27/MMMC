import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { identifier, code, type } = await req.json();

    if (!identifier || !code) {
      return NextResponse.json({ message: 'Identifier dan kode OTP wajib diisi' }, { status: 400 });
    }

    // Find valid unexpired verification token in DB
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        email: identifier,
        code,
        verified: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!tokenRecord) {
      return NextResponse.json({ message: 'Kode OTP salah atau sudah kedaluwarsa. Silakan minta kode baru.' }, { status: 400 });
    }

    // Mark token as verified
    await prisma.verificationToken.update({
      where: { id: tokenRecord.id },
      data: { verified: true },
    });

    // Update user status
    let updatedUser = null;
    if (type === 'email' || identifier.includes('@')) {
      updatedUser = await prisma.user.update({
        where: { email: identifier },
        data: { verified: true, emailVerified: true },
      });
    } else {
      const profile = await prisma.userProfile.findFirst({
        where: { whatsapp: { contains: identifier } },
      });
      if (profile) {
        updatedUser = await prisma.user.update({
          where: { id: profile.userId },
          data: { verified: true, whatsappVerified: true },
        });
      }
    }

    return NextResponse.json({
      message: 'Verifikasi OTP berhasil!',
      success: true,
      username: updatedUser?.username || 'buyer_new',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
