import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial services...');
  
  // 1. Web Development
  await prisma.service.create({
    data: {
      title: 'Enterprise Web Development',
      description: 'We build high-performance, scalable, and beautifully designed web applications tailored to your business needs.',
      icon: '🌐',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000'
    }
  });

  // 2. AI Agents
  await prisma.service.create({
    data: {
      title: 'Autonomous AI Agents',
      description: 'Deploy 24/7 AI agents that handle customer support, sales outreach, and internal operations automatically.',
      icon: '🤖',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000'
    }
  });

  console.log('Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
