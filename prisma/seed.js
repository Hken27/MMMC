const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin Bootstrap
  const adminUsername = process.env.ADMIN_BOOTSTRAP_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'admin1234';
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@cmmm.local';

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const existingAdmin = await prisma.user.findUnique({ where: { username: adminUsername } });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        username: adminUsername,
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        verified: true,
        emailVerified: true,
        whatsappVerified: true,
        mustChangePassword: true,
      },
    });
    console.log(`✅ Admin user created: ${adminUsername}`);
  }

  // Ensure user 'joko' with password '12341234' exists for testing
  const jokoUser = await prisma.user.findUnique({ where: { username: 'joko' } });
  const jokoPasswordHash = await bcrypt.hash('12341234', 10);

  if (!jokoUser) {
    await prisma.user.create({
      data: {
        email: 'joko@cmmm.local',
        username: 'joko',
        passwordHash: jokoPasswordHash,
        role: 'BUYER',
        verified: true,
        emailVerified: true,
        whatsappVerified: true,
        profile: {
          create: {
            fullName: 'Joko Widodo',
            whatsapp: '+628123456799',
            businessSector: 'Export/Import',
            street: 'Jl. Merdeka No. 45',
            subdistrict: 'Menteng',
            district: 'Menteng',
            city: 'Jakarta Pusat',
            province: 'DKI Jakarta',
            country: 'ID',
          },
        },
      },
    });
    console.log(`✅ Test buyer "joko" created with password "12341234"`);
  } else {
    await prisma.user.update({
      where: { username: 'joko' },
      data: { passwordHash: jokoPasswordHash, verified: true },
    });
    console.log(`✅ Test buyer "joko" password updated to "12341234"`);
  }

  // Ensure user 'wahyu' with password '12341234' exists for testing
  const wahyuUser = await prisma.user.findUnique({ where: { username: 'wahyu' } });
  const wahyuPasswordHash = await bcrypt.hash('12341234', 10);

  if (!wahyuUser) {
    await prisma.user.create({
      data: {
        email: 'wahyu@cmmm.local',
        username: 'wahyu',
        passwordHash: wahyuPasswordHash,
        role: 'BUYER',
        verified: true,
        emailVerified: true,
        whatsappVerified: true,
        profile: {
          create: {
            fullName: 'Wahyu Test',
            whatsapp: '+62812345678',
            businessSector: 'Industrial',
            street: 'Jl. Test No. 1',
            subdistrict: 'Test',
            district: 'Test',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            country: 'ID',
          },
        },
      },
    });
    console.log(`✅ Test buyer "wahyu" created with password "12341234"`);
  } else {
    await prisma.user.update({
      where: { username: 'wahyu' },
      data: { passwordHash: wahyuPasswordHash, verified: true },
    });
    console.log(`✅ Test buyer "wahyu" password updated to "12341234"`);
  }

  console.log('\n✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
