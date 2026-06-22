import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/automata_auth_token=([^;]+)/);
    const user = tokenMatch ? verifyToken(tokenMatch[1]) : null;

    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (!settings) return NextResponse.json({});

    // Mask API key if not super admin
    if (!user || user.role !== 'SUPER_ADMIN') {
      settings.aiApiKey = settings.aiApiKey ? '********' : '';
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/automata_auth_token=([^;]+)/);
    const user = tokenMatch ? verifyToken(tokenMatch[1]) : null;
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    
    // Don't update API key if it's masked
    if (body.aiApiKey === '********') {
      delete body.aiApiKey;
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: body,
      create: { id: 'default', ...body }
    });

    // Mask before returning
    settings.aiApiKey = settings.aiApiKey ? '********' : '';

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
