'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useGetStatisticsOverview from './useGetStatisticsOverview';
import useGetStatisticsJobs from './useGetStatisticsJobs';
import {
  activeJobsDesignOverview,
  activeJobsDesignRows,
} from '../constants/active-jobs-preview';
import { DASHBOARD_JOBS_PAGE_SIZE } from '../constants/dashboard-config';
import type { DashboardJobsTableState } from '../index.type';

export function useActiveJobsPage(designPreview: boolean) {
  const [page, setPage] = useState(1);
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? '';
  const accountId = session?.user?.id;
  const sessionLoading = status === 'loading';
  const overviewQuery = useGetStatisticsOverview({
    token,
    accountId,
    enabled: !designPreview,
  });
  const jobsQuery = useGetStatisticsJobs({
    token,
    accountId,
    page,
    enabled: !designPreview,
  });

  const jobs: DashboardJobsTableState = {
    page,
    setPage,
    rows: designPreview ? activeJobsDesignRows : (jobsQuery.data?.data ?? []),
    total: designPreview
      ? activeJobsDesignRows.length
      : (jobsQuery.data?.total ?? 0),
    pageSize: jobsQuery.data?.perPage ?? DASHBOARD_JOBS_PAGE_SIZE,
    loading:
      !designPreview &&
      (sessionLoading ||
        (Boolean(token) &&
          (jobsQuery.isPending || jobsQuery.isPlaceholderData))),
    error: !designPreview && jobsQuery.isError,
    retry: () => void jobsQuery.refetch(),
  };

  return {
    overview: designPreview ? activeJobsDesignOverview : overviewQuery.data,
    overviewLoading:
      !designPreview &&
      (sessionLoading || (Boolean(token) && overviewQuery.isPending)),
    overviewError: !designPreview && overviewQuery.isError,
    overviewLoadError: overviewQuery.error,
    retryOverview: () => void overviewQuery.refetch(),
    jobs,
  };
}
