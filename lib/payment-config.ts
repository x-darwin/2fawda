import { supabase } from './supabase';
import type { Database } from './database.types';

export type PaymentProvider = 'stripe' | 'sumup';

export interface PaymentConfig {
  id?: number;
  provider: PaymentProvider;
  isEnabled: boolean;
  stripePrivateKey?: string | null;
  stripePublicKey?: string | null;
  sumupMerchantEmail?: string | null;
  sumupKey?: string | null;
}

type PaymentConfigRow = Database['public']['Tables']['payment_config']['Row'];
type PaymentConfigInsert = Database['public']['Tables']['payment_config']['Insert'];
type PaymentConfigUpdate = Database['public']['Tables']['payment_config']['Update'];

export const getPaymentConfig = async (): Promise<PaymentConfig> => {
  const { data, error } = await supabase
    .from('payment_config')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    provider: data.provider,
    isEnabled: data.is_enabled,
    stripePrivateKey: data.stripe_private_key,
    stripePublicKey: data.stripe_public_key,
    sumupMerchantEmail: data.sumup_merchant_email,
    sumupKey: data.sumup_key
  };
};

export const updatePaymentConfig = async (config: Partial<PaymentConfig>): Promise<PaymentConfig> => {
  const { data: existing } = await supabase
    .from('payment_config')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const updates: PaymentConfigUpdate = {
    provider: config.provider ?? existing?.provider ?? 'sumup',
    is_enabled: config.isEnabled ?? existing?.is_enabled ?? true,
    stripe_private_key: config.stripePrivateKey ?? existing?.stripe_private_key,
    stripe_public_key: config.stripePublicKey ?? existing?.stripe_public_key,
    sumup_merchant_email: config.sumupMerchantEmail ?? existing?.sumup_merchant_email,
    sumup_key: config.sumupKey ?? existing?.sumup_key,
    updated_at: new Date().toISOString()
  };

  let query;
  if (existing) {
    // Update existing record
    query = supabase
      .from('payment_config')
      .update(updates)
      .eq('id', existing.id);
  } else {
    // Insert new record
    const insert: PaymentConfigInsert = {
      ...updates,
      provider: updates.provider!,
      is_enabled: updates.is_enabled!
    };
    
    query = supabase
      .from('payment_config')
      .insert(insert);
  }

  const { data, error } = await query.select().single();

  if (error) throw error;

  return {
    id: data.id,
    provider: data.provider,
    isEnabled: data.is_enabled,
    stripePrivateKey: data.stripe_private_key,
    stripePublicKey: data.stripe_public_key,
    sumupMerchantEmail: data.sumup_merchant_email,
    sumupKey: data.sumup_key
  };
};