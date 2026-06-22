import { NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/csrf';

export async function GET() {
  const token = generateCSRFToken();
  const response = NextResponse.json({ token });
  
  // Set HttpOnly cookie for CSRF validation later
  response.cookies.set('csrf_token', token.split('.')[0], {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
