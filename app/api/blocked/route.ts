import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCountryFromIP } from '@/lib/getCountryFromIP';

export async function GET(request: NextRequest) {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   request.ip || 
                   '0.0.0.0';
                   
  const countryCode = await getCountryFromIP(clientIP);
  const blockedCountries = process.env.NEXT_PUBLIC_BLOCKED_COUNTRIES?.split(',')
    .map(country => country.trim().toUpperCase()) || [];
  
  const isBlocked = blockedCountries.includes(countryCode);
  
  // Only return minimal information
  return NextResponse.json({
    blocked: isBlocked,
    country: countryCode
  });
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
