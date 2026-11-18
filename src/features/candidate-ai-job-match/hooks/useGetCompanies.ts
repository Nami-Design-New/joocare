'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getCompanyLookupService } from '../services/company-lookup-service';

export default function useGetCompanies(search = '') {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';

  const query = useInfiniteQuery({
    queryKey: ['companies', locale, search],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getCompanyLookupService({
        locale,
        token,
        page: pageParam,
        search,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: status === 'authenticated' && Boolean(token),
  });

  return {
    ...query,
    companies: query.data?.pages.flatMap((page) => page.companies) ?? [],
  };
}
