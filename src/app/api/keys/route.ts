import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — Fetch all API Keys
export async function GET() {
  try {
    const keys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' }
    });
    // Mask the actual key values for security (show only last 8 chars)
    const masked = keys.map(k => ({
      ...k,
      apiKey: '••••••••' + k.apiKey.slice(-8)
    }));
    return NextResponse.json(masked);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch keys' }, { status: 500 });
  }
}

// POST — Add a new API Key
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, provider, apiKey } = body;

    if (!name || !provider || !apiKey) {
      return NextResponse.json({ error: 'Name, Provider, and API Key are required' }, { status: 400 });
    }

    const newKey = await prisma.apiKey.create({
      data: { name, provider, apiKey, isActive: true }
    });

    return NextResponse.json({ 
      message: `API Key "${name}" saved successfully!`,
      id: newKey.id 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save key' }, { status: 500 });
  }
}

// DELETE — Remove an API Key
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
    }

    await prisma.apiKey.delete({ where: { id } });
    return NextResponse.json({ message: 'Key deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete key' }, { status: 500 });
  }
}
