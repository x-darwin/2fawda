'use client';

import { useEffect, useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements as StripeElementsType } from '@stripe/stripe-js';
import { usePaymentProvider } from '@/hooks/usePaymentProvider';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface StripeElementsProps {
  onCardChange: (complete: boolean) => void;
  onStripeReady: (stripe: Stripe, elements: StripeElementsType) => void;
}

export function StripeElements({ onCardChange, onStripeReady }: StripeElementsProps) {
  const [loading, setLoading] = useState(true);
  const { stripePublicKey } = usePaymentProvider();
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElementsType | null>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const { theme } = useTheme();

  const handleCardChange = useCallback((event: any) => {
    onCardChange(event.complete);
    setError(event.error ? event.error.message : null);
  }, [onCardChange]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!stripePublicKey) {
        setError('Stripe public key is missing');
        setLoading(false);
        return;
      }

      try {
        const stripeInstance = await loadStripe(stripePublicKey);
        if (!stripeInstance || !mounted) return;

        const elementsInstance = stripeInstance.elements();
        
        if (mounted) {
          setStripe(stripeInstance);
          setElements(elementsInstance);
          onStripeReady(stripeInstance, elementsInstance);

          const card = elementsInstance.create('card', {
            style: {
              base: {
                color: theme === 'dark' ? '#ffffff' : '#0f172a',
                fontSize: '16px',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSmoothing: 'antialiased',
                '::placeholder': {
                  color: theme === 'dark' ? '#64748b' : '#94a3b8',
                },
                backgroundColor: 'transparent',
                iconColor: theme === 'dark' ? '#ffffff' : '#0f172a',
              },
              invalid: {
                color: '#ef4444',
                iconColor: '#ef4444',
              },
            },
            hidePostalCode: true,
          });

          setCardElement(card);
          
          // Use requestAnimationFrame to ensure the container exists
          requestAnimationFrame(() => {
            const container = document.getElementById('stripe-element-container');
            if (container && mounted) {
              card.mount(container);
              card.on('change', handleCardChange);
              setLoading(false);
            }
          });
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Stripe initialization error:', err);
          setError(err.message || 'Failed to initialize Stripe');
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (cardElement) {
        cardElement.off('change', handleCardChange);
        cardElement.unmount();
      }
    };
  }, [stripePublicKey, onStripeReady, handleCardChange, theme]);

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "min-h-[40px] p-3 rounded-md border transition-all duration-200",
          loading && "animate-pulse",
          error ? "border-destructive" : "border-input",
          theme === 'dark' ? "bg-card" : "bg-background"
        )}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div id="stripe-element-container" className="min-h-[20px]" />
        )}
      </div>
      {error && (
        <div className="text-sm text-destructive mt-2">
          {error}
        </div>
      )}
    </div>
  );
}