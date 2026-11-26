'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  PROJECTS_PAGE_SIZE,
  projectQueryKeys,
  REFETCH_STALE_ON_MOUNT,
} from '../constants/project-queries';
import { getProjects } from '../services/projects-service';
import { useProjectRequestOptions } from './useProjectRequestOptions';

export function useGetProjects(
  search: string,
  page: number,
  recruiterId: string,
) {
  const { token, locale, isReady } = useProjectRequestOptions();
  return useQuery({
    ...REFETCH_STALE_ON_MOUNT,
    queryKey: projectQueryKeys.projects(locale, search, page, recruiterId),
    enabled: isReady,
    placeholderData: keepPreviousData,
    queryFn: () =>
      getProjects(search, page, PROJECTS_PAGE_SIZE, recruiterId, {
        token,
        locale,
      }),
  });
}
