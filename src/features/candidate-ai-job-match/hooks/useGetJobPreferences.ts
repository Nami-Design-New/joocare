'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getJobPreferencesService } from '../services/job-preferences-service';

export const jobPreferencesQueryKey = (locale: string) => [
  'candidate-job-preferences',
  locale,
];

export default function useGetJobPreferences() {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';

  return useQuery({
    queryKey: jobPreferencesQueryKey(locale),
    queryFn: () => getJobPreferencesService({ locale, token }),
    enabled: status === 'authenticated' && Boolean(token),
  });
}
