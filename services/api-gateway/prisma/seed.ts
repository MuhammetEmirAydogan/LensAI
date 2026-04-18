import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Veritabanı başlangıç verileri oluşturuluyor...');
  
  // Default Team (Admin)
  const team = await prisma.team.upsert({
    where: { slug: 'admin-team' },
    update: {},
    create: {
      name: 'Admin Team',
      slug: 'admin-team',
      plan: 'enterprise',
    },
  });

  console.log(`Team oluşturuldu: ${team.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
