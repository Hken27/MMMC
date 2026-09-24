import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      whatsapp,
      email,
      password,
      businessSector,
      street,
      subdistrict,
      district,
      city,
      province,
      country,
    } = body;

    // Validation
    if (!fullName || !whatsapp || !email || !password || !businessSector || !country || !city) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Generate username from fullName (with uniqueness check)
    let username = fullName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    let counter = 1;
    let uniqueUsername = username;
    while (await prisma.user.findUnique({ where: { username: uniqueUsername } })) {
      uniqueUsername = `${username}_${counter}`;
      counter++;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        username: uniqueUsername,
        passwordHash,
        role: 'BUYER',
        verified: false,
        emailVerified: false,
        whatsappVerified: false,
        profile: {
          create: {
            fullName,
            whatsapp,
            businessSector,
            street: street || '',
            subdistrict: subdistrict || '',
            district: district || '',
            city,
            province: province || '',
            country,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Registrasi berhasil. Silakan verifikasi email Anda.',
        username: uniqueUsername,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registrasi gagal. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
