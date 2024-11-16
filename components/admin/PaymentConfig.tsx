'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { usePaymentConfig } from '@/lib/hooks/usePaymentConfig';

export function PaymentConfig() {
  const { toast } = useToast();
  const { config, isLoading, isUpdating, updateProvider, toggleProvider, updateKeys } = usePaymentConfig();
  const [stripePrivateKey, setStripePrivateKey] = useState('');
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [sumupKey, setSumupKey] = useState('');
  const [sumupMerchantEmail, setSumupMerchantEmail] = useState('');

  useEffect(() => {
    if (config) {
      setStripePrivateKey(config.stripePrivateKey || '');
      setStripePublicKey(config.stripePublicKey || '');
      setSumupKey(config.sumupKey || '');
      setSumupMerchantEmail(config.sumupMerchantEmail || '');
    }
  }, [config]);

  const handleSaveKeys = () => {
    updateKeys({
      stripePrivateKey,
      stripePublicKey,
      sumupKey,
      sumupMerchantEmail,
    });
    toast({
      title: 'Success',
      description: 'Payment configuration updated successfully',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No configuration found
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Gateway Configuration</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Payment Provider</h3>
            <p className="text-sm text-muted-foreground">
              Select which payment gateway to use
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant={config.provider === 'sumup' ? 'default' : 'outline'}
              onClick={() => updateProvider('sumup')}
              disabled={!config.isEnabled || isUpdating}
            >
              {isUpdating && config.provider !== 'sumup' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              SumUp
            </Button>
            <Button
              variant={config.provider === 'stripe' ? 'default' : 'outline'}
              onClick={() => updateProvider('stripe')}
              disabled={!config.isEnabled || isUpdating}
            >
              {isUpdating && config.provider !== 'stripe' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Stripe
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Payment Processing</h3>
            <p className="text-sm text-muted-foreground">
              Enable or disable payment processing
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isUpdating && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <Switch
              checked={config.isEnabled}
              onCheckedChange={toggleProvider}
              disabled={isUpdating}
            />
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <div className="space-y-4">
            {config.provider === 'stripe' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="stripe-private-key">Stripe Private Key</Label>
                  <Input
                    id="stripe-private-key"
                    type="password"
                    value={stripePrivateKey}
                    onChange={(e) => setStripePrivateKey(e.target.value)}
                    placeholder="sk_test_..."
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-public-key">Stripe Public Key</Label>
                  <Input
                    id="stripe-public-key"
                    type="password"
                    value={stripePublicKey}
                    onChange={(e) => setStripePublicKey(e.target.value)}
                    placeholder="pk_test_..."
                    disabled={isUpdating}
                  />
                </div>
              </>
            )}

            {config.provider === 'sumup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sumup-key">SumUp API Key</Label>
                  <Input
                    id="sumup-key"
                    type="password"
                    value={sumupKey}
                    onChange={(e) => setSumupKey(e.target.value)}
                    placeholder="Enter SumUp API key"
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sumup-merchant-email">SumUp Merchant Email</Label>
                  <Input
                    id="sumup-merchant-email"
                    type="email"
                    value={sumupMerchantEmail}
                    onChange={(e) => setSumupMerchantEmail(e.target.value)}
                    placeholder="merchant@example.com"
                    disabled={isUpdating}
                  />
                </div>
              </>
            )}

            <Button 
              onClick={handleSaveKeys} 
              className="w-full"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save API Keys'
              )}
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-2">Current Configuration</h3>
          <div className="space-y-2">
            <p>
              Active Provider: <span className="font-medium">{config.provider}</span>
            </p>
            <p>
              Status:{' '}
              <span
                className={`font-medium ${
                  config.isEnabled ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {config.isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}