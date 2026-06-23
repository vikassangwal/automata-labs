import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const adminEmail = 'admin@antigravity.com';
    const adminPassword = 'admin123';
    
    // Create admin user
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: {
          name: 'Super Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isVerified: true,
        },
      });
    }

    // Create Site Settings
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        siteName: 'Anti Gravity 2.0',
        siteTagline: 'AI-Powered Blogging Platform',
        adminEmail: adminEmail,
        seoTitle: 'Anti Gravity 2.0 | AI-Powered Blog',
        seoDescription: 'Advanced AI-Powered Blogging Platform',
      },
    });

    return NextResponse.json({ success: true, message: 'Database successfully initialized! You can now log in.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
