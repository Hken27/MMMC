import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Business sectors list
  const businessSectors = [
    'Retail',
    'Restaurant & Cafe',
    'Hotel & Hospitality',
    'Industrial',
    'Manufacturing',
    'Agriculture',
    'Export/Import',
    'Catering',
    'Other',
  ];

  console.log(`📋 Business sectors: ${businessSectors.join(', ')}`);

  // ====== Admin Bootstrap User ======
  const adminUsername = process.env.ADMIN_BOOTSTRAP_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'admin1234';
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@cmmm.local';

  if (!adminUsername || !adminPassword || !adminEmail) {
    throw new Error('❌ Admin bootstrap credentials not set in .env.local');
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    console.log(`✅ Admin user "${adminUsername}" already exists, skipping...`);
  } else {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        username: adminUsername,
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        verified: true,
        emailVerified: true,
        whatsappVerified: true,
      },
    });
    console.log(`✅ Admin user created: ${admin.username} (${admin.email})`);
  }

  // ====== Dummy Buyer Users (for testing) ======
  const dummyBuyers = [
    {
      email: 'buyer1@example.com',
      username: 'buyer_1',
      fullName: 'John Doe',
      whatsapp: '+6281234567890',
      businessSector: 'Restaurant & Cafe',
      city: 'Jakarta',
      country: 'ID',
    },
    {
      email: 'buyer2@example.com',
      username: 'buyer_2',
      fullName: 'Jane Smith',
      whatsapp: '+6289876543210',
      businessSector: 'Catering',
      city: 'Surabaya',
      country: 'ID',
    },
  ];

  for (const buyerData of dummyBuyers) {
    const existingBuyer = await prisma.user.findUnique({
      where: { username: buyerData.username },
    });

    if (existingBuyer) {
      console.log(`⏭️  Buyer "${buyerData.username}" already exists, skipping...`);
      continue;
    }

    const passwordHash = await bcrypt.hash('buyer1234', 10);
    const buyer = await prisma.user.create({
      data: {
        email: buyerData.email,
        username: buyerData.username,
        passwordHash,
        role: 'BUYER',
        verified: true,
        emailVerified: true,
        whatsappVerified: true,
        profile: {
          create: {
            fullName: buyerData.fullName,
            whatsapp: buyerData.whatsapp,
            businessSector: buyerData.businessSector,
            street: 'Jl. Example No. 123',
            subdistrict: 'Kelurahan Test',
            district: 'Kecamatan Test',
            city: buyerData.city,
            province: 'Test Province',
            country: buyerData.country,
            postalCode: '12345',
          },
        },
      },
    });

    console.log(`✅ Dummy buyer created: ${buyer.username} (${buyer.email})`);
  }

  console.log('\n✨ Seeding complete!');
  console.log('\n⚠️  NOTE: Dummy data is for dev/staging only. Do NOT seed to production.');
  console.log(`\n🔐 Admin credentials (dev/staging only):`);
  console.log(`   Username: ${adminUsername}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`\n📝 Dummy buyer credentials (for testing):`);
  dummyBuyers.forEach((b) => {
    console.log(`   Username: ${b.username}, Password: buyer1234`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
