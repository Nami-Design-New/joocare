'use client';

import { useInfiniteLookup } from '@/shared/hooks/useInfiniteLookup';
import {
  PROJECT_OPTIONS_PAGE_SIZE,
  PROJECT_OPTIONS_QUERY_KEY,
} from '../constants/project-queries';
import { getProjectOptions } from '../services/projects-service';
import type {
  ProjectOption,
  ProjectOptionsPage,
} from '../types/company-projects.types';
import { useProjectRequestOptions } from './useProjectRequestOptions';

// Company projects for the "Add to project" picker (server search, load more).
export function useGetProjectOptions(search: string) {
  const { token, locale, isReady } = useProjectRequestOptions();
  const query = useInfiniteLookup({
    endpoint: 'company/projects-list',
    queryKey: PROJECT_OPTIONS_QUERY_KEY,
    search,
    limitPerPage: PROJECT_OPTIONS_PAGE_SIZE,
    enabled: isReady,
    refetchOnMount: true,
    loadPage: (page) =>
      getProjectOptions(search, page, PROJECT_OPTIONS_PAGE_SIZE, {
        token,
        locale,
      }),
  });
  const projects: ProjectOption[] =
    query.data?.pages.flatMap((page: ProjectOptionsPage) => page.data) ?? [];
  return { ...query, projects };
}
