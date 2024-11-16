'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminHeader({ showSettings = true }: { showSettings?: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const token = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('token')
    : null;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear the admin token cookie
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      // Redirect to login with the access token
      router.push(`/admin/login?token=${token}`);
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSettings = () => {
    router.push(`/admin/settings?token=${token}`);
  };

  const handleDashboard = () => {
    router.push(`/admin?token=${token}`);
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">
        {showSettings ? 'Dashboard' : 'Settings'}
      </h1>
      <div className="flex gap-4">
        {showSettings ? (
          <Button
            variant="outline"
            onClick={handleSettings}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleDashboard}
            className="flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        )}
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}