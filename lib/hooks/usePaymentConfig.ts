'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaymentProvider } from '@/lib/payment-config';

interface PaymentConfig {
  provider: PaymentProvider;
  isEnabled: boolean;
  stripePrivateKey?: string;
  stripePublicKey?: string;
  sumupKey?: string;
  sumupMerchantEmail?: string;
}

interface UpdateKeysPayload {
  stripePrivateKey?: string;
  stripePublicKey?: string;
  sumupKey?: string;
  sumupMerchantEmail?: string;
}

export function usePaymentConfig() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: config, isLoading } = useQuery<PaymentConfig>({
    queryKey: ['paymentConfig'],
    queryFn: async () => {
      const response = await fetch('/api/payment/config');
      if (!response.ok) throw new Error('Failed to fetch payment config');
      return response.json();
    },
  });

  const updateProviderMutation = useMutation({
    mutationFn: async (provider: PaymentProvider) => {
      const response = await fetch('/api/payment/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      if (!response.ok) throw new Error('Failed to update provider');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentConfig'] });
    },
  });

  const toggleProviderMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/payment/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: !config?.isEnabled }),
      });
      if (!response.ok) throw new Error('Failed to toggle provider');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentConfig'] });
    },
  });

  const updateKeysMutation = useMutation({
    mutationFn: async (payload: UpdateKeysPayload) => {
      const response = await fetch('/api/payment/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update keys');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentConfig'] });
    },
  });

  const updateProvider = async (provider: PaymentProvider) => {
    setIsUpdating(true);
    try {
      await updateProviderMutation.mutateAsync(provider);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleProvider = async () => {
    setIsUpdating(true);
    try {
      await toggleProviderMutation.mutateAsync();
    } finally {
      setIsUpdating(false);
    }
  };

  const updateKeys = async (payload: UpdateKeysPayload) => {
    setIsUpdating(true);
    try {
      await updateKeysMutation.mutateAsync(payload);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    config,
    isLoading,
    isUpdating,
    updateProvider,
    toggleProvider,
    updateKeys,
  };
}