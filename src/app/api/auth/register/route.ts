import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateOTP } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and Password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name: name || '',
        email,
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: false,
        otpCode,
        otpExpiry,
      }
    });

    // In Demo Mode: Return OTP in response (in production, send via email)
    // TODO: Replace with Nodemailer when Gmail App Password is configured
    console.log(`[OTP for ${email}]: ${otpCode}`);

    return NextResponse.json({ 
      message: 'Account created! Please verify OTP.',
      userId: user.id,
      demoOtp: otpCode // Remove this in production!
    }, { status: 201 });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
