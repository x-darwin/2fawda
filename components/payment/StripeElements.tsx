'use client';

import { useEffect, useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements as StripeElementsType } from '@stripe/stripe-js';
import { usePaymentProvider } from '@/hooks/usePaymentProvider';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StripeElementsProps {
  onCardChange: (complete: boolean) => void;
  onStripeReady: (stripe: Stripe, elements: StripeElementsType) => void;
}

interface DebugInfo {
  stripeLoaded: boolean;
  elementsCreated: boolean;
  containerMounted: boolean;
  publicKeyAvailable: boolean;
  lastError: string | null;
}

export function StripeElements({ onCardChange, onStripeReady }: StripeElementsProps) {
  const [loading, setLoading] = useState(true);
  const { stripePublicKey } = usePaymentProvider();
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElementsType | null>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const { theme } = useTheme();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    stripeLoaded: false,
    elementsCreated: false,
    containerMounted: false,
    publicKeyAvailable: false,
    lastError: null
  });

  const updateDebugInfo = useCallback((updates: Partial<DebugInfo>) => {
    setDebugInfo(prev => ({ ...prev, ...updates }));
  }, []);

  const handleCardChange = useCallback((event: any) => {
    onCardChange(event.complete);
    if (event.error) {
      setError(event.error.message);
      updateDebugInfo({ lastError: event.error.message });
    } else {
      setError(null);
      updateDebugInfo({ lastError: null });
    }
  }, [onCardChange, updateDebugInfo]);

  useEffect(() => {
    let mounted = true;
    const containerId = 'stripe-element-container';

    const init = async () => {
      // Update initial debug state
      updateDebugInfo({
        publicKeyAvailable: !!stripePublicKey,
        stripeLoaded: false,
        elementsCreated: false,
        containerMounted: !!document.getElementById(containerId)
      });

      if (!stripePublicKey) {
        console.error('Stripe initialization failed: Missing public key');
        setError('Payment system configuration error');
        setLoading(false);
        return;
      }

      try {
        const stripeInstance = await loadStripe(stripePublicKey);
        if (!stripeInstance || !mounted) return;

        updateDebugInfo({ stripeLoaded: true });

        const elementsInstance = stripeInstance.elements();
        updateDebugInfo({ elementsCreated: true });
        
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
          
          // Mount with error handling
          const container = document.getElementById(containerId);
          if (container && mounted) {
            try {
              card.mount(container);
              updateDebugInfo({ containerMounted: true });
              card.on('change', handleCardChange);
              setLoading(false);
            } catch (mountError: any) {
              console.error('Card mount error:', mountError);
              updateDebugInfo({ 
                lastError: mountError.message,
                containerMounted: false 
              });
              setError('Failed to initialize payment form');
            }
          } else {
            updateDebugInfo({ 
              containerMounted: false,
              lastError: 'Container element not found' 
            });
            setError('Payment form container not found');
          }
        }
      } catch (err: any) {
        console.error('Stripe initialization error:', err);
        updateDebugInfo({
          stripeLoaded: false,
          lastError: err.message
        });
        setError('Failed to initialize payment system');
        setLoading(false);
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
  }, [stripePublicKey, onStripeReady, handleCardChange, theme, updateDebugInfo]);

  // Debug panel for development
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
      <div className="mt-4 p-4 border rounded-md bg-muted/50 text-sm">
        <h4 className="font-semibold mb-2">Stripe Debug Info:</h4>
        <ul className="space-y-1">
          <li>Public Key: {debugInfo.publicKeyAvailable ? '✅' : '❌'}</li>
          <li>Stripe Loaded: {debugInfo.stripeLoaded ? '✅' : '❌'}</li>
          <li>Elements Created: {debugInfo.elementsCreated ? '✅' : '❌'}</li>
          <li>Container Mounted: {debugInfo.containerMounted ? '✅' : '❌'}</li>
          {debugInfo.lastError && (
            <li className="text-destructive">Last Error: {debugInfo.lastError}</li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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

      {renderDebugInfo()}
    </div>
  );
}
