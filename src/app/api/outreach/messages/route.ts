import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — fetch all outreach messages
export async function GET() {
  try {
    const messages = await prisma.outreachMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
