import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'ADMIN',
        isVerified: true // Auto-verified since it's created by an admin
      }
    });

    return NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } }, { status: 201 });
  } catch (error) {
    console.error('Add user error:', error);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}
