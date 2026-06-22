import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = await prisma.portfolio.create({
      data: {
        title: body.title,
        category: body.category,
        type: body.type || 'Project',
        status: body.status || 'Published',
        imageUrl: body.imageUrl || null,
        websiteLink: body.websiteLink || null,
      }
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 });
  }
}
