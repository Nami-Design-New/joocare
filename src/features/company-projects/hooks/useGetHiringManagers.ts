'use client';

import { useQuery } from '@tanstack/react-query';
import {
  projectQueryKeys,
  REFETCH_STALE_ON_MOUNT,
} from '../constants/project-queries';
import { getHiringManagers } from '../services/projects-service';
import { useProjectRequestOptions } from './useProjectRequestOptions';

export function useGetHiringManagers(enabled = true) {
  const { token, locale, isReady } = useProjectRequestOptions();
  return useQuery({
    ...REFETCH_STALE_ON_MOUNT,
    queryKey: projectQueryKeys.hiringManagers(locale),
    enabled: isReady && enabled,
    queryFn: () => getHiringManagers({ token, locale }),
  });
}
