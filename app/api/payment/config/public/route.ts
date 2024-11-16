import { NextResponse } from 'next/server';
import { getPaymentConfig } from '@/lib/payment-config';

export async function GET() {
  try {
    const config = await getPaymentConfig();
    
    // Return necessary public information including Stripe public key
    return NextResponse.json({
      provider: config.provider,
      isEnabled: config.isEnabled,
      stripePublicKey: config.stripePublicKey
    }, {
      headers: {
        'Cache-Control': 'private, max-age=300', // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Failed to get payment configuration:', error);
    return NextResponse.json(
      { error: 'Failed to get payment configuration' },
      { status: 500 }
    );
  }
}