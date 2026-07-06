import { PrismaClient } from "@prisma/client";

// alihusain.me database (source)
const source = new PrismaClient({
  datasourceUrl: process.env.SOURCE_DATABASE_URL,
});

// johnny5.tech database (target) — uses DATABASE_URL from .env
const target = new PrismaClient();

async function main() {
  const users = await source.user.findMany();
  console.log(`Found ${users.length} user(s) in alihusain.me database:\n`);

  for (const user of users) {
    console.log(`  - ${user.email} (${user.name ?? "no name"})`);

    await target.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: user.password,
        image: user.image,
        emailVerified: user.emailVerified,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        image: user.image,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });
  }

  console.log(`\n✅ Synced ${users.length} user(s) to johnny5.tech database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await source.$disconnect();
    await target.$disconnect();
  });
