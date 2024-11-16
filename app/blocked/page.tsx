'use client';

import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { ContactButton } from './components/contact-button';

export default function BlockedPage() {
  const [countryCode, setCountryCode] = useState<string>('your region');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBlockedInfo = async () => {
      try {
        const response = await fetch('/api/blocked');
        const data = await response.json();
        setCountryCode(data.country);
      } catch (error) {
        console.error('Failed to get blocked info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getBlockedInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Access Restricted
          </h1>
          <div className="mt-4 space-y-4">
            <p className="text-muted-foreground">
              We apologize, but this service is not available in {countryCode} due to regional restrictions.
            </p>
            <ContactButton />
          </div>
        </div>
      </div>
    </div>
  );
}
