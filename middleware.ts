import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCountryFromIP } from '@/lib/getCountryFromIP';
import { verifyAuth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const PUBLIC_FILES = /\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2|ttf|eot)$/i;
const PUBLIC_PATHS = ['/blocked', '/api/blocked', '/_next', '/favicon.ico', '/api/auth'];

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

function getClientIP(request: NextRequest): string {
  if (process.env.NODE_ENV === 'development') {
    return '127.0.0.1';
  }

  const ip = 
    request.headers.get('cf-connecting-ip') || 
    request.headers.get('x-real-ip') || 
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
    request.ip;

  return ip || '0.0.0.0';
}

async function handleAdminAuth(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get('token');
  const validAccessToken = process.env.ADMIN_ACCESS_TOKEN;

  if (pathname === '/api/auth/logout') {
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    if (!accessToken || accessToken !== validAccessToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!accessToken || accessToken !== validAccessToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL(`/admin/login?token=${accessToken}`, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

async function handleGeoBlocking(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path)) || PUBLIC_FILES.test(pathname)) {
    return NextResponse.next();
  }

  const clientIP = getClientIP(request);
  
  try {
    const countryCode = process.env.NODE_ENV === 'development' 
      ? (process.env.TEST_COUNTRY || 'MA')
      : await getCountryFromIP(clientIP);

    // Check blocked countries from Supabase
    const { data: blockedCountry } = await supabaseAdmin
      .from('blocked_countries')
      .select('country_code')
      .eq('country_code', countryCode)
      .single();

    if (blockedCountry) {
      const response = NextResponse.redirect(new URL('/blocked', request.url));
      response.headers.set('X-Country-Blocked', countryCode);
      response.headers.set('X-Client-IP', clientIP);
      return response;
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow access (fail open)
    return NextResponse.next();
  }

  return NextResponse.next();
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add comprehensive security headers
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self' https://*.stripe.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://*.stripe.com",
      "img-src 'self' data: https://*.stripe.com https://q.stripe.com",
      "frame-src 'self' https://*.stripe.com https://js.stripe.com https://hooks.stripe.com",
      "connect-src 'self' https://*.stripe.com https://api.stripe.com https://m.stripe.com https://q.stripe.com",
      "font-src 'self' data: https://*.stripe.com",
      "object-src 'none'",
      "media-src 'self'",
      "form-action 'self' https://*.stripe.com",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ')
  );

  // Add other security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy', 
    'payment=*, geolocation=(), camera=(), microphone=()'
  );
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let response: NextResponse;

  if (pathname.startsWith('/admin')) {
    response = await handleAdminAuth(request);
  } else {
    response = await handleGeoBlocking(request);
  }

  // Add security headers to the response
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico).*)'],
};