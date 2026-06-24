import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Increase pool timeout to 30s to allow Neon serverless DB to wake up from sleep
let url = process.env.DATABASE_URL || '';
if (url && !url.includes('pool_timeout')) {
  url += (url.includes('?') ? '&' : '?') + 'pool_timeout=30';
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: { url }
    }
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
