'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import {
  type EnumLookupEndpoint,
  getEnumLookupService,
} from '../services/lookup-service';

export default function useGetEnumLookup(endpoint: EnumLookupEndpoint) {
  const locale = useLocale();

  return useQuery({
    queryKey: [endpoint, locale],
    queryFn: () => getEnumLookupService({ endpoint, locale }),
    staleTime: Infinity,
  });
}
