'use client';

import { useQuery } from '@tanstack/react-query';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import {
  projectQueryKeys,
  REFETCH_STALE_ON_MOUNT,
} from '../constants/project-queries';
import { getProject } from '../services/projects-service';
import { useProjectRequestOptions } from './useProjectRequestOptions';

const HTTP_NOT_FOUND = 404;

export function useGetProject(projectId: string) {
  const { token, locale, isReady } = useProjectRequestOptions();
  return useQuery({
    ...REFETCH_STALE_ON_MOUNT,
    queryKey: projectQueryKeys.project(locale, projectId),
    enabled: isReady && Boolean(projectId),
    retry: (count, error) =>
      getHttpStatusCode(error) !== HTTP_NOT_FOUND && count < 1,
    queryFn: () => getProject(projectId, { token, locale }),
  });
}
