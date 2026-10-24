import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    let buyerId = session.user.id;

    // Robust fallback: if session.user.id is missing, look up user by email from session
    if (!buyerId && session.user.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) {
        buyerId = dbUser.id;
      }
    }

    if (!buyerId) {
      return NextResponse.json({ error: 'User not found in session.' }, { status: 401 });
    }

    const body = await req.json();
    const { nama, email, perusahaan, produk, qty, pesan, orderConfig } = body;

    if (!nama || !email || !pesan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiryNumber = `INQ-${Date.now().toString().slice(-6)}`;

    // Build full message with order config if available
    let fullMessage = `Nama: ${nama}\nEmail: ${email}\nPerusahaan: ${perusahaan}\nProduk: ${produk}\nQty: ${qty || '-'}\n\nPesan:\n${pesan}`;

    if (orderConfig) {
      fullMessage += `\n\n=== KONFIGURASI ORDER ===\nTipe Pengiriman: ${orderConfig.deliveryType}\nMOQ: ${orderConfig.moq}\nPakaging: ${orderConfig.packaging}\nPengiriman: ${orderConfig.shipping}\nSubtotal: Rp${orderConfig.subtotal.toLocaleString('id-ID')}`;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        buyerId,
        inquiryNumber,
        message: fullMessage,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry berhasil dikirim dan disimpan ke database.',
      inquiryNumber: inquiry.inquiryNumber,
    });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
