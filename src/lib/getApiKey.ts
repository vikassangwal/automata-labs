import { prisma } from '@/lib/prisma';

/**
 * Fetches an API key from the database by provider name.
 * Returns the raw key string or null if not found/inactive.
 */
export async function getApiKey(provider: string): Promise<string | null> {
  try {
    const record = await prisma.apiKey.findFirst({
      where: { provider, isActive: true },
      orderBy: { createdAt: 'desc' } // latest key wins
    });
    return record?.apiKey || null;
  } catch {
    return null;
  }
}

/**
 * Fetches all active API keys for a given provider.
 */
export async function getAllApiKeys(provider: string) {
  try {
    return await prisma.apiKey.findMany({
      where: { provider, isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch {
    return [];
  }
}
