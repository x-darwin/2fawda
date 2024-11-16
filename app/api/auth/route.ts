import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { validateCredentials, createToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password, token } = await request.json();

    // Verify access token
    const validAccessToken = process.env.ADMIN_ACCESS_TOKEN;
    if (!validAccessToken || token !== validAccessToken) {
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 401 }
      );
    }

    // Validate credentials
    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const jwt = await createToken(username);

    // Create response
    const response = NextResponse.json({ success: true });

    // Set secure cookie
    response.cookies.set('admin_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}