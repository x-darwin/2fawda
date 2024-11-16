import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const inputSchema = z.object({
  code: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    // Validate the input
    const { code } = inputSchema.parse(body);

    // Check if coupon exists and is valid
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .single();

    if (couponError) {
      console.error('Coupon lookup error:', couponError);
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Check if coupon is expired
    if (new Date(coupon.valid_until) < new Date()) {
      return NextResponse.json(
        { error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check if coupon has reached max uses
    if (coupon.current_uses >= coupon.max_uses) {
      return NextResponse.json(
        { error: 'Coupon has reached maximum uses' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      validUntil: coupon.valid_until,
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to validate coupon'
      },
      { status: 500 }
    );
  }
}