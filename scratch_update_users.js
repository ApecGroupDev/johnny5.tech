const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash password for peggy
  const password = await bcrypt.hash('peggy06305', 10);
  
  // Upsert peggy
  const peggy = await prisma.user.upsert({
    where: { email: 'peggy@theapecgroup.com' },
    update: { password },
    create: {
      email: 'peggy@theapecgroup.com',
      name: 'Peggy',
      password
    }
  });
  console.log('Upserted peggy:', peggy.email);

  // Delete jsalazar and wbayoumi
  const emailsToDelete = [
    'jsalazar@theapecgroup.com',
    'wbayoumi@theapecgroup.com'
  ];

  for (const email of emailsToDelete) {
    const prefix = email.split('@')[0];
    try {
      const res = await prisma.user.deleteMany({
        where: { email: { contains: prefix } }
      });
      console.log(`Deleted ${res.count} users matching: ${prefix}`);
    } catch (e) {
      console.log(`Error deleting matching ${prefix}`, e.message);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
