'use client';

import { useInfiniteLookup } from '@/shared/hooks/useInfiniteLookup';
import {
  PROJECT_RECRUITERS_PAGE_SIZE,
  PROJECT_RECRUITERS_QUERY_KEY,
} from '../constants/project-queries';
import { getProjectRecruiters } from '../services/projects-service';
import type { ProjectRecruitersPage } from '../types/company-projects.types';
import { useProjectRequestOptions } from './useProjectRequestOptions';

export function useGetProjectRecruiters() {
  const { token, locale, isReady } = useProjectRequestOptions();
  const query = useInfiniteLookup({
    endpoint: 'company/recruiters-list',
    queryKey: PROJECT_RECRUITERS_QUERY_KEY,
    limitPerPage: PROJECT_RECRUITERS_PAGE_SIZE,
    enabled: isReady,
    refetchOnMount: true,
    loadPage: (page) =>
      getProjectRecruiters(page, PROJECT_RECRUITERS_PAGE_SIZE, {
        token,
        locale,
      }),
  });
  const recruiters =
    query.data?.pages.flatMap((page: ProjectRecruitersPage) => page.data) ?? [];

  return { ...query, recruiters };
}
