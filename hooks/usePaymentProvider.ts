'use client';

import { useQuery } from '@tanstack/react-query';
import type { PaymentProvider } from '@/lib/payment-config';

interface PaymentProviderConfig {
  provider: PaymentProvider;
  isEnabled: boolean;
  stripePublicKey: string | null;
}

export function usePaymentProvider() {
  const { data, isLoading, error } = useQuery<PaymentProviderConfig>({
    queryKey: ['paymentProviderConfig'],
    queryFn: async () => {
      const response = await fetch('/api/payment/config/public');
      if (!response.ok) {
        throw new Error('Failed to fetch payment configuration');
      }
      const data = await response.json();
      
      // Ensure stripePublicKey is properly handled
      if (data.provider === 'stripe' && !data.stripePublicKey) {
        throw new Error('Stripe public key is missing');
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once to avoid excessive retries with missing config
  });

  return {
    provider: data?.provider || 'sumup',
    isEnabled: data?.isEnabled ?? false,
    stripePublicKey: data?.stripePublicKey || null,
    isLoading,
    error,
    isStripeReady: data?.provider === 'stripe' && !!data?.stripePublicKey,
  };
}
