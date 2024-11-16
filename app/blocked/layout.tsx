'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlockedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/blocked');
        const data = await response.json();
        
        if (!data.blocked) {
          router.replace('/');
        }
      } catch (error) {
        console.error('Failed to check access:', error);
        router.replace('/');
      }
    };

    checkAccess();
  }, [router]);

  return <main className="flex-grow relative z-10">{children}</main>;
}
