import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function GET() {
  try {
    const token = cookies().get('admin_token')?.value;

    if (!token) {
      console.log('No auth token found');
      return NextResponse.json({ isAuthenticated: false });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('Valid auth token found');
    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
}