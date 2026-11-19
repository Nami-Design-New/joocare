'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getCvBuilderService } from '../services/cv-builder-service';

export const cvBuilderQueryKey = (locale: string) =>
  ['candidate-cv-builder', locale] as const;

export function useGetCvBuilder() {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';

  const query = useQuery({
    queryKey: cvBuilderQueryKey(locale),
    queryFn: () => getCvBuilderService({ locale, token }),
    enabled: Boolean(token),
  });

  return {
    ...query,
    isLoading: status === 'loading' || (Boolean(token) && query.isPending),
  };
}


