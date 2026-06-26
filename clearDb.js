const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.heroContent.deleteMany();
  await prisma.service.deleteMany();
  await prisma.portfolioProject.deleteMany();
  console.log('Database cleared!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
