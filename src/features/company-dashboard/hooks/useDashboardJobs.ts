'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useGetCompanyTableJobs from './useGetCompanyTableJobs';
import { dashboardDesignJobs } from '../constants/dashboard-preview';

export function useDashboardJobs(designPreview: boolean) {
  const [page, setPage] = useState(1);
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';
  const query = useGetCompanyTableJobs({
    token,
    page,
    accountId: session?.user?.id,
    enabled: !designPreview,
  });
  return {
    page,
    setPage,
    jobs: designPreview ? dashboardDesignJobs : query.jobs,
    total: designPreview ? 57 : query.total,
    pageSize: designPreview ? 10 : query.perPage,
    loading:
      !designPreview &&
      (status === 'loading' || (Boolean(token) && query.isLoading)),
    error: !designPreview && query.isError,
    retry: query.refetch,
  };
}
