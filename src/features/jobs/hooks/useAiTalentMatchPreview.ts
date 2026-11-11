'use client';

import { useEffect, useState } from 'react';
import { talentPreviewCandidates } from '@/features/company-talent-database/constants/talent-preview-data';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import {
  AI_TALENT_MATCH_PAGE_SIZE,
  JOB_SEARCH_DEBOUNCE_MS,
} from '../constants';

const FILTER_KEYS = ['order', 'country', 'license'] as const;
type AiMatchFilterKey = (typeof FILTER_KEYS)[number];

// Preview only: AI Talent Match has no API yet, so it filters the Talent Database fixtures.
export function useAiTalentMatchPreview() {
  const { get, getPage, update } = useUrlFilters();
  const urlSearch = get('search');
  const [search, setSearch] = useState(urlSearch);
  const filters = {
    order: get('order'),
    country: get('country'),
    license: get('license'),
  };
  const page = getPage();

  useEffect(() => {
    if (search.trim() === urlSearch) return;
    const timer = window.setTimeout(
      () => update({ search: search.trim(), page: null }),
      JOB_SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [search, urlSearch, update]);

  const query = urlSearch.toLowerCase();
  const filtered = talentPreviewCandidates.filter((candidate) => {
    const matchesSearch =
      !query ||
      candidate.name.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query);
    const matchesCountry =
      !filters.country || candidate.attributes.country === filters.country;
    const hasLicense = candidate.attributes['license-status'] === 'valid';
    const matchesLicense =
      !filters.license || (filters.license === 'valid') === hasLicense;
    return matchesSearch && matchesCountry && matchesLicense;
  });
  const ordered =
    filters.order === 'oldest' ? [...filtered].reverse() : filtered;
  const hasFilters = Boolean(
    urlSearch || FILTER_KEYS.some((key) => filters[key]),
  );

  return {
    search,
    setSearch,
    filters,
    hasFilters,
    setFilter: (key: AiMatchFilterKey, value: string) =>
      update({ [key]: value, page: null }),
    reset: () => {
      setSearch('');
      update({
        search: null,
        order: null,
        country: null,
        license: null,
        page: null,
      });
    },
    page,
    setPage: (next: number) => update({ page: next }),
    total: ordered.length,
    candidates: ordered.slice(
      (page - 1) * AI_TALENT_MATCH_PAGE_SIZE,
      page * AI_TALENT_MATCH_PAGE_SIZE,
    ),
  };
}

export type AiTalentMatchPreview = ReturnType<typeof useAiTalentMatchPreview>;
