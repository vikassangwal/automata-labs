import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const about = await prisma.aboutSetting.findUnique({ where: { id: 'default' } });
    if (!about) {
      // Return defaults if not found
      return NextResponse.json({
        heading: 'About Us',
        content: 'Welcome to our company. We build future-proof software.',
        mission: 'To automate the world.',
        imageUrl: ''
      });
    }
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { heading, content, mission, imageUrl } = body;

    const updated = await prisma.aboutSetting.upsert({
      where: { id: 'default' },
      update: { heading, content, mission, imageUrl },
      create: { id: 'default', heading, content, mission, imageUrl }
    });

    return NextResponse.json({ success: true, about: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}
