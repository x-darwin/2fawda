'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PaymentConfig } from "@/components/admin/PaymentConfig";
import { BlockedCountries } from "@/components/admin/BlockedCountries";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (!response.ok) {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <AdminHeader showSettings={false} />

        <div className="grid gap-8">
          <BlockedCountries />
          <PaymentConfig />
        </div>
      </div>
    </div>
  );
}
