import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';
import { prisma } from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  let siteName = 'Anti Gravity 2.0';
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (settings?.siteName) siteName = settings.siteName;
  } catch (error) {}
  
  return {
    title: `${siteName} | World-Class AI Automation Agency`,
    description: 'Websites, AI Agents, Automation Systems and Business Growth Solutions Built For The Future.',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let siteName = 'Automata Labs.';
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (settings?.siteName) siteName = settings.siteName;
  } catch (error) {}

  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ClientLayoutWrapper siteName={siteName}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
