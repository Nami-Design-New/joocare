'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import {
  projectQueryKeys,
  REFETCH_STALE_ON_MOUNT,
} from '../constants/project-queries';
import { getCandidateProfile } from '../services/projects-service';
import { mapCandidateProfile } from '../utils/candidate-profile-mapper';
import type { CandidateProfileLabels } from '../types/candidate-profile.types';
import { useProjectRequestOptions } from './useProjectRequestOptions';

const HTTP_NOT_FOUND = 404;

// A candidate's full profile as the company sees it (`users/{id}/profile`).
export function useGetCandidateProfile(userId: string) {
  const t = useTranslations('companyPage.projects.candidate-profile');
  const { token, locale, isReady } = useProjectRequestOptions();
  const query = useQuery({
    ...REFETCH_STALE_ON_MOUNT,
    queryKey: projectQueryKeys.candidateProfile(locale, userId),
    enabled: isReady && Boolean(userId),
    retry: (count, error) =>
      getHttpStatusCode(error) !== HTTP_NOT_FOUND && count < 1,
    queryFn: () => getCandidateProfile(userId, { token, locale }),
  });

  const profile = useMemo(() => {
    if (!query.data) return null;
    const labels: CandidateProfileLabels = {
      locale,
      present: t('present'),
      yes: t('yes'),
      no: t('no'),
      // Unknown API values are shown as they come.
      value: (group, value) => {
        const key = `values.${group}.${value}`;
        return t.has(key) ? t(key) : value;
      },
    };
    return mapCandidateProfile(query.data, labels);
  }, [query.data, locale, t]);

  return { ...query, profile };
}
