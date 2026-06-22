import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/automata_auth_token=([^;]+)/);
    const user = tokenMatch ? verifyToken(tokenMatch[1]) : null;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const link = await prisma.socialLink.create({ data: body });
    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/automata_auth_token=([^;]+)/);
    const user = tokenMatch ? verifyToken(tokenMatch[1]) : null;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, ...data } = body;
    const link = await prisma.socialLink.update({ where: { id }, data });
    return NextResponse.json({ success: true, link });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/automata_auth_token=([^;]+)/);
    const user = tokenMatch ? verifyToken(tokenMatch[1]) : null;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.socialLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }
}
