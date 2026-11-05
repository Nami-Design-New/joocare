'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  AI_JOB_MATCH_PAGE_SIZE,
  EMPTY_JOB_PREFERENCES,
  HIGH_MATCH_THRESHOLD,
} from '../constants';
import {
  JOB_MATCH_PREVIEW,
  JOB_MATCH_PREVIEW_TOTAL,
} from '../constants/ai-job-match-preview-data';
import type {
  AiJobMatchScenario,
  JobPreferences,
  JobPreferencesMode,
} from '../types/ai-job-match.types';

// Page state for AI Job Match. Preferences are kept locally until the API is ready.
export function useAiJobMatch(scenario: AiJobMatchScenario) {
  const t = useTranslations('candidatePage.aiJobMatch');
  const [preferences, setPreferences] = useState<JobPreferences | null>(
    scenario === 'empty' ? null : EMPTY_JOB_PREFERENCES,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [page, setPage] = useState(1);

  const matches = useMemo(
    () =>
      preferences?.highMatchOnly
        ? JOB_MATCH_PREVIEW.filter((job) => job.score >= HIGH_MATCH_THRESHOLD)
        : JOB_MATCH_PREVIEW,
    [preferences?.highMatchOnly],
  );
  const mode: JobPreferencesMode = preferences ? 'edit' : 'add';

  function savePreferences(values: JobPreferences) {
    setPreferences(values);
    setPreferencesOpen(false);
    setPage(1);
    toast.success(t(mode === 'add' ? 'preferences-saved' : 'matches-updated'));
  }

  return {
    preferences,
    hasPreferences: Boolean(preferences),
    mode,
    matches,
    totalMatches: preferences?.highMatchOnly
      ? matches.length
      : JOB_MATCH_PREVIEW_TOTAL,
    page,
    pageSize: AI_JOB_MATCH_PAGE_SIZE,
    setPage,
    preferencesOpen,
    openPreferences: () => setPreferencesOpen(true),
    setPreferencesOpen,
    savePreferences,
  };
}
