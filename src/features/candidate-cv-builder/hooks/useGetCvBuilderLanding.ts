'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getCvBuilderLandingService } from '../services/cv-builder-service';

export const cvBuilderLandingQueryKey = (locale: string) => [
  'candidate-cv-builder',
  locale,
];

export function useGetCvBuilderLanding() {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';

  return useQuery({
    queryKey: cvBuilderLandingQueryKey(locale),
    queryFn: () => getCvBuilderLandingService({ locale, token }),
    enabled: status === 'authenticated' && Boolean(token),
  });
}
