'use client';

import { useSession } from 'next-auth/react';
import { useInfiniteLookup } from '@/shared/hooks/useInfiniteLookup';
import { ASSESSMENT_SEARCH_DEBOUNCE_MS } from '../constants/assessment-queries';
import {
  ASSIGNMENT_CANDIDATES_PAGE_SIZE,
  ASSIGNMENT_CANDIDATES_QUERY_KEY,
} from '../constants/assessment-invitations';
import { getAssignmentCandidates } from '../services/assessment-assignment-service';
import type {
  AssignmentCandidate,
  AssignmentCandidatesPage,
} from '../types/assessment-invitation.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';
import { useDebouncedValue } from './useDebouncedValue';

export function useGetAssignmentCandidates(search: string, enabled: boolean) {
  const { token, locale, isReady } = useAssessmentRequestOptions();
  const { data: session } = useSession();
  const debouncedSearch = useDebouncedValue(
    search.trim(),
    ASSESSMENT_SEARCH_DEBOUNCE_MS,
  );
  const query = useInfiniteLookup({
    endpoint: 'company/users-list',
    queryKey: ASSIGNMENT_CANDIDATES_QUERY_KEY,
    search: debouncedSearch,
    limitPerPage: ASSIGNMENT_CANDIDATES_PAGE_SIZE,
    enabled: enabled && isReady && session?.authRole === 'employer',
    scope: String(session?.user?.id ?? ''),
    loadPage: (page) =>
      getAssignmentCandidates(
        debouncedSearch,
        page,
        ASSIGNMENT_CANDIDATES_PAGE_SIZE,
        { token, locale },
      ),
  });
  const candidates: AssignmentCandidate[] =
    query.data?.pages.flatMap((page: AssignmentCandidatesPage) => page.data) ??
    [];
  return {
    ...query,
    candidates,
    isSearching: search.trim() !== debouncedSearch,
  };
}
