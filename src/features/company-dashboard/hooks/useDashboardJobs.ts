'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useGetCompanyTableJobs from './useGetCompanyTableJobs';
import { dashboardDesignJobs } from '../constants/dashboard-preview';
import type {
  CompanyJob,
  DashboardJobRow,
  DashboardJobsTableState,
} from '../index.type';

function toJobRow(job: CompanyJob): DashboardJobRow {
  return {
    id: job.id,
    title: job.job_title?.title ?? job.title ?? '',
    views_num: job.views_num,
    applications_count: job.applications_count,
    created_at: job.created_at,
  };
}

export function useDashboardJobs(
  designPreview: boolean,
): DashboardJobsTableState {
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
    rows: (designPreview ? dashboardDesignJobs : query.jobs).map(toJobRow),
    total: designPreview ? 57 : query.total,
    pageSize: query.perPage,
    loading:
      !designPreview &&
      (status === 'loading' || (Boolean(token) && query.isLoading)),
    error: !designPreview && query.isError,
    retry: () => void query.refetch(),
  };
}
