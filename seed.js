const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({});

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@automatalabs.com' },
    update: {},
    create: {
      email: 'admin@automatalabs.com',
      name: 'Admin User',
      passwordHash,
      role: 'admin',
    },
  });
  console.log('Test user created:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
