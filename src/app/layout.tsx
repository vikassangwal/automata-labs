import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'Anti Gravity 2.0 | World-Class AI Automation Agency',
  description: 'Websites, AI Agents, Automation Systems and Business Growth Solutions Built For The Future.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
