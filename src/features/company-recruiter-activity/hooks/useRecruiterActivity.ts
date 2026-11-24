'use client';

import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import {
  ALL_RECRUITERS_VALUE,
  RECRUITER_ACTIVITY_PAGE_SIZE,
} from '../constants';
import { useGetRecruiterOptions } from './useGetRecruiterOptions';
import { useGetRecruitersStats } from './useGetRecruitersStats';

export function useRecruiterActivity() {
  const url = useUrlFilters();
  const recruiter = url.get('recruiter');
  const page = url.getPage();
  const statsQuery = useGetRecruitersStats({ page, adminId: recruiter });
  const optionsQuery = useGetRecruiterOptions();

  return {
    recruiter,
    page,
    recruiters: statsQuery.data?.recruiters ?? [],
    total: statsQuery.data?.total ?? 0,
    pageSize: statsQuery.data?.perPage ?? RECRUITER_ACTIVITY_PAGE_SIZE,
    recruiterOptions: optionsQuery.data ?? [],
    isLoading: statsQuery.isPending,
    isError: statsQuery.isError,
    error: statsQuery.error,
    retry: () => void statsQuery.refetch(),
    setPage: (nextPage: number) => url.update({ page: nextPage }),
    updateRecruiter: (value: string) =>
      url.update({
        recruiter: value === ALL_RECRUITERS_VALUE ? '' : value,
        page: null,
      }),
  };
}
