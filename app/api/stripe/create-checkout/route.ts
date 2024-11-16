import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPaymentConfig } from '@/lib/payment-config';

interface CheckoutResponse {
  clientSecret: string | null;
  status: Stripe.PaymentIntent.Status;
  requires_action: boolean;
  next_action: Stripe.PaymentIntent.NextAction | null;
}

export async function POST(request: NextRequest) {
  try {
    const config = await getPaymentConfig();
    
    if (!config.stripePrivateKey) {
      return NextResponse.json(
        { error: 'Stripe API key not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(config.stripePrivateKey, {
      apiVersion: '2024-10-28.acacia',
    });

    const body = await request.json();
    const {
      amount,
      currency,
      checkout_reference,
      description,
      clientData,
      paymentMethodId
    } = body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${request.nextUrl.origin}/success`,
      metadata: {
        checkout_reference,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        country: clientData.country,
      },
      payment_method_types: ['card'],
    });

    const response: CheckoutResponse = {
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      requires_action: paymentIntent.status === 'requires_action',
      next_action: paymentIntent.next_action,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    
    let errorMessage = 'Failed to process payment';
    let errorCode = 'payment_failed';
    let status = 500;

    if (error.type === 'StripeCardError') {
      errorMessage = error.message;
      errorCode = error.code;
      status = 400;
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = 'Invalid payment request';
      errorCode = 'invalid_request';
      status = 400;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        code: errorCode,
        requires_action: error.type === 'StripeCardError' && 
                        error.code === 'authentication_required'
      },
      { status }
    );
  }
}