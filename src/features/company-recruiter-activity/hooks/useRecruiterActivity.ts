'use client';

import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import {
  ALL_RECRUITERS_VALUE,
  RECRUITER_ACTIVITY_PAGE_SIZE,
  recruiterActivityPreview,
} from '../constants/recruiter-activity-preview-data';

export function useRecruiterActivity() {
  const url = useUrlFilters();
  const recruiter = url.get('recruiter');
  const page = url.getPage();

  const filteredRecruiters = recruiter
    ? recruiterActivityPreview.filter((item) => item.id === recruiter)
    : recruiterActivityPreview;
  const visibleRecruiters = filteredRecruiters.slice(
    (page - 1) * RECRUITER_ACTIVITY_PAGE_SIZE,
    page * RECRUITER_ACTIVITY_PAGE_SIZE,
  );

  return {
    recruiter,
    page,
    pageSize: RECRUITER_ACTIVITY_PAGE_SIZE,
    recruiterOptions: recruiterActivityPreview,
    totalRecruiters: recruiterActivityPreview.length,
    filteredCount: filteredRecruiters.length,
    recruiters: visibleRecruiters,
    setPage: (nextPage: number) => url.update({ page: nextPage }),
    updateRecruiter: (value: string) =>
      url.update({
        recruiter: value === ALL_RECRUITERS_VALUE ? '' : value,
        page: null,
      }),
  };
}
