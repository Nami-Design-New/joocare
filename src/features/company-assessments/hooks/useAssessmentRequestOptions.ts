'use client';

import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';

// Token + locale shared by every company assessments request.
export function useAssessmentRequestOptions() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';
  return { token, locale, isReady: Boolean(token) };
}
