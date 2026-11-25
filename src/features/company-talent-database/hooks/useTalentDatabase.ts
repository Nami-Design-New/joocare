'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useToggleCandidatePin } from '@/shared/hooks/useToggleCandidatePin';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import {
  TALENT_SEARCH_DEBOUNCE_MS,
  TALENT_SEARCH_QUERY_KEY,
} from '../constants/talent-filters';
import type {
  MessageRecipient,
  TalentCandidate,
  TalentCandidatesPage,
  TalentFilterValues,
} from '../types/talent-database.types';
import {
  readTalentFilters,
  TALENT_RESULTS_VIEW,
  TALENT_URL_KEYS,
  toTalentFilterParams,
} from '../utils/talent-url-filters';
import { useSearchCandidates } from './useSearchCandidates';

const toRecipient = ({ id, name }: TalentCandidate): MessageRecipient => ({
  id,
  name,
});

// Filters, results view, page and search live in the URL so a search can be shared.
export function useTalentDatabase() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { get, getPage, update } = useUrlFilters();
  const paramsKey = searchParams.toString();
  const filters = useMemo(
    () => readTalentFilters(new URLSearchParams(paramsKey)),
    [paramsKey],
  );
  const showResults = get(TALENT_URL_KEYS.view) === TALENT_RESULTS_VIEW;
  const query = get(TALENT_URL_KEYS.search);
  const page = getPage();
  const [search, setSearch] = useState(query);
  const [selected, setSelected] = useState<MessageRecipient[]>([]);
  const [messageOpen, setMessageOpen] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const results = useSearchCandidates(
    { filters, search: query, page },
    showResults,
  );
  const candidates = results.data?.candidates ?? [];
  const selectedIds = selected.map((candidate) => candidate.id);
  const queryClient = useQueryClient();
  const togglePin = useToggleCandidatePin({
    // Show the new star on every cached results page without a refetch.
    onToggled: (userId, isPinned) =>
      queryClient.setQueriesData<TalentCandidatesPage>(
        { queryKey: [TALENT_SEARCH_QUERY_KEY] },
        (current) =>
          current && {
            ...current,
            candidates: current.candidates.map((candidate) =>
              candidate.id === userId ? { ...candidate, isPinned } : candidate,
            ),
          },
      ),
  });

  // Follow the URL when it changes from outside (Back / Forward, a shared link).
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    if (query !== search.trim()) setSearch(query);
  }

  // Typing searches after a short pause; Enter / the button search right away.
  useEffect(() => {
    if (!showResults || search.trim() === query) return;
    const timer = window.setTimeout(() => {
      update({ [TALENT_URL_KEYS.search]: search.trim(), page: null });
      setSelected([]);
    }, TALENT_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [showResults, search, query, update]);

  function toggleCandidate(id: string) {
    setSelected((current) => {
      if (current.some((candidate) => candidate.id === id)) {
        return current.filter((candidate) => candidate.id !== id);
      }
      const candidate = candidates.find((item) => item.id === id);
      return candidate ? [...current, toRecipient(candidate)] : current;
    });
  }
  function toggleAll() {
    const pageIds = candidates.map((candidate) => candidate.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelected((current) =>
      allSelected
        ? current.filter((candidate) => !pageIds.includes(candidate.id))
        : [
            ...current,
            ...candidates
              .filter((candidate) => !selectedIds.includes(candidate.id))
              .map(toRecipient),
          ],
    );
  }
  function applyFilters(values: TalentFilterValues) {
    const params = toTalentFilterParams(values);
    // Keep the filters on the form entry, so Back returns to a filled form.
    const formQuery = params.toString();
    const formPath = window.location.pathname;
    window.history.replaceState(
      null,
      '',
      formQuery ? `${formPath}?${formQuery}` : formPath,
    );
    params.set(TALENT_URL_KEYS.view, TALENT_RESULTS_VIEW);
    router.push(`${pathname}?${params.toString()}`);
    setSelected([]);
    setSearch('');
  }
  function applySearch() {
    update({ [TALENT_URL_KEYS.search]: search.trim(), page: null });
    setSelected([]);
  }
  function messageCandidate(candidate: TalentCandidate) {
    setSelected([toRecipient(candidate)]);
    setMessageOpen(true);
  }
  async function previewSendMessage() {
    // Preview only: replace this callback with an authorized API mutation when available.
    setSentCount(selected.length);
    setMessageOpen(false);
    setSelected([]);
  }
  return {
    filters,
    showResults,
    search,
    setSearch,
    applySearch,
    page,
    setPage: (next: number) => update({ page: next }),
    candidates,
    total: results.data?.total ?? 0,
    pageSize: results.data?.perPage,
    isLoading: results.isLoading,
    isError: results.isError,
    error: results.error,
    retry: () => void results.refetch(),
    selected,
    selectedIds,
    toggleCandidate,
    toggleAll,
    togglePin: (candidate: TalentCandidate) => togglePin.toggle(candidate.id),
    applyFilters,
    messageOpen,
    setMessageOpen,
    sentCount,
    setSentCount,
    previewSendMessage,
    messageCandidate,
  };
}
