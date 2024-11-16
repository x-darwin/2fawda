'use client';

import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export function HomeAnalytics() {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('landing_page_view', {
      page: 'home'
    });
  }, [posthog]);

  return null;
}