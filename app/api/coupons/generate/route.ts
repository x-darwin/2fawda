import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const inputSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    // Validate the input
    const { email, phone } = inputSchema.parse(body);

    // Check if user already has a coupon
    const { data: existingCoupon, error: existingError } = await supabase
      .from('coupons')
      .select('*')
      .eq('description', email)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing coupon:', existingError);
      throw new Error('Failed to check existing coupon');
    }

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'You have already claimed a coupon' },
        { status: 400 }
      );
    }

    // Generate a unique coupon code
    const couponCode = `WELCOME5-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setDate(now.getDate() + 30); // Valid for 30 days

    // Store phone number in description field along with email
    const description = `${email}|${phone}`;

    // Create the coupon in the database
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .insert([
        {
          code: couponCode,
          discount_type: 'fixed',
          discount_value: 5,
          valid_from: now.toISOString(),
          valid_until: validUntil.toISOString(),
          max_uses: 1,
          current_uses: 0,
          description: description, // Store both email and phone
        },
      ])
      .select()
      .single();

    if (couponError) {
      console.error('Coupon creation error:', couponError);
      throw new Error('Failed to create coupon');
    }

    return NextResponse.json({
      success: true,
      couponCode: coupon.code,
      discount: coupon.discount_value,
      validUntil: coupon.valid_until,
    });
  } catch (error) {
    console.error('Coupon generation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to generate coupon'
      },
      { status: 500 }
    );
  }
}