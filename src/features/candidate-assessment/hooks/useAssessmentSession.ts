'use client';

import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';

export function useAssessmentSession() {
  const { data: session, status } = useSession();
  return {
    token: session?.accessToken ?? '',
    locale: useLocale(),
    userId: session?.user?.id,
    enabled: status === 'authenticated' && session?.authRole === 'candidate',
  };
}
