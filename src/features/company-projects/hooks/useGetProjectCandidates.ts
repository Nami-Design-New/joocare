'use client';

import { useQuery } from '@tanstack/react-query';
import {
  projectQueryKeys,
  REFETCH_STALE_ON_MOUNT,
} from '../constants/project-queries';
import { getProjectCandidates } from '../services/projects-service';
import { useProjectRequestOptions } from './useProjectRequestOptions';

export function useGetProjectCandidates(projectId: string, status = '') {
  const { token, locale, isReady } = useProjectRequestOptions();
  return useQuery({
    ...REFETCH_STALE_ON_MOUNT,
    queryKey: [
      ...projectQueryKeys.projectCandidates(locale, projectId),
      status,
    ],
    enabled: isReady && Boolean(projectId),
    queryFn: () => getProjectCandidates(projectId, { token, locale }, status),
  });
}
