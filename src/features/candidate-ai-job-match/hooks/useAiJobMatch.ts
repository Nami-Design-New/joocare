'use client';

import { useState } from 'react';
import type {
  JobPreferences,
  JobPreferencesMode,
} from '../types/ai-job-match.types';
import useGetJobPreferences from './useGetJobPreferences';
import useGetRecommendedJobs from './useGetRecommendedJobs';
import useSaveJobPreferences from './useSaveJobPreferences';

export function useAiJobMatch() {
  const preferencesQuery = useGetJobPreferences();
  const savePreferencesMutation = useSaveJobPreferences();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [page, setPage] = useState(1);
  const preferences = preferencesQuery.data ?? null;
  const recommendedJobsQuery = useGetRecommendedJobs(page, Boolean(preferences));
  const mode: JobPreferencesMode = preferences ? 'edit' : 'add';

  function savePreferences(values: JobPreferences) {
    savePreferencesMutation.mutate(values, {
      onSuccess: () => {
        setPreferencesOpen(false);
        setPage(1);
      },
    });
  }

  return {
    preferences,
    isLoading: preferencesQuery.isPending,
    isError: preferencesQuery.isError,
    retry: () => void preferencesQuery.refetch(),
    isSaving: savePreferencesMutation.isPending,
    hasPreferences: Boolean(preferences),
    mode,
    matches: recommendedJobsQuery.data?.jobs ?? [],
    totalMatches: recommendedJobsQuery.data?.total ?? 0,
    matchesPage: recommendedJobsQuery.data?.currentPage ?? page,
    matchesPageSize: recommendedJobsQuery.data?.perPage ?? 0,
    isMatchesLoading: recommendedJobsQuery.isPending,
    isMatchesError: recommendedJobsQuery.isError,
    retryMatches: () => void recommendedJobsQuery.refetch(),
    setPage,
    preferencesOpen,
    openPreferences: () => setPreferencesOpen(true),
    setPreferencesOpen,
    savePreferences,
  };
}
