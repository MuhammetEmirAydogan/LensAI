import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─────────────────────────────────────
  // TEST TAKIM
  // ─────────────────────────────────────
  const team = await prisma.team.upsert({
    where: { slug: 'lensai-team' },
    update: {},
    create: {
      name: 'LensAI Team',
      slug: 'lensai-team',
      plan: 'agency',
    },
  });
  console.log('✅ Team created:', team.name);

  // ─────────────────────────────────────
  // TEST KULLANICI (dev için)
  // ─────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lensai.io' },
    update: {},
    create: {
      clerkId: 'clerk_dev_admin',
      email: 'admin@lensai.io',
      name: 'LensAI Admin',
      plan: 'agency',
      videosLimit: -1, // unlimited
      teamId: team.id,
      role: 'owner',
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

  const proUser = await prisma.user.upsert({
    where: { email: 'pro@lensai.io' },
    update: {},
    create: {
      clerkId: 'clerk_dev_pro',
      email: 'pro@lensai.io',
      name: 'Pro User',
      plan: 'pro',
      videosLimit: 200,
    },
  });
  console.log('✅ Pro user created:', proUser.email);

  const freeUser = await prisma.user.upsert({
    where: { email: 'free@lensai.io' },
    update: {},
    create: {
      clerkId: 'clerk_dev_free',
      email: 'free@lensai.io',
      name: 'Free User',
      plan: 'free',
      videosLimit: 5,
    },
  });
  console.log('✅ Free user created:', freeUser.email);

  // ─────────────────────────────────────
  // TEST PROJE
  // ─────────────────────────────────────
  const project = await prisma.project.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      userId: adminUser.id,
      name: 'Demo Project',
      description: 'LensAI demo ürün videoları',
      status: 'active',
    },
  });
  console.log('✅ Demo project created:', project.name);

  // ─────────────────────────────────────
  // TEST BRAND KIT
  // ─────────────────────────────────────
  await prisma.brandKit.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      userId: adminUser.id,
      name: 'LensAI Brand',
      primaryColor: '#7C3AED',
      secondaryColor: '#F59E0B',
      fontName: 'Inter',
    },
  });
  console.log('✅ Brand kit created');

  // ─────────────────────────────────────
  // TEST ABONELİK
  // ─────────────────────────────────────
  await prisma.subscription.upsert({
    where: { userId: proUser.id },
    update: {},
    create: {
      userId: proUser.id,
      plan: 'pro',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Pro subscription created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Test Users:');
  console.log('  admin@lensai.io (Agency plan)');
  console.log('  pro@lensai.io   (Pro plan)');
  console.log('  free@lensai.io  (Free plan)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
