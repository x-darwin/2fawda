import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getPaymentConfig, updatePaymentConfig } from '@/lib/payment-config';

export async function GET(request: NextRequest) {
  try {
    if (!(await verifyAuth(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await getPaymentConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to get payment configuration:', error);
    return NextResponse.json(
      { error: 'Failed to get payment configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAuth(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updatedConfig = await updatePaymentConfig(body);
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Failed to update payment configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update payment configuration' },
      { status: 500 }
    );
  }
}
