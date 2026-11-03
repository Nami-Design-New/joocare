'use client';

import { useEffect, useState } from 'react';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import { ALL_RECRUITERS_VALUE, JOB_SEARCH_DEBOUNCE_MS } from '../constants';

// Filters live in the URL and are sent to the jobs endpoint; pins stay local until the API supports them.
export function useJobListingFilters() {
  const url = useUrlFilters();
  const status = url.get('status');
  const recruiter = url.get('recruiter');
  const search = url.get('search');
  const page = url.getPage();
  const [searchInput, setSearchInput] = useState(search);
  const [pinnedJobIds, setPinnedJobIds] = useState<Set<number>>(
    () => new Set(),
  );
  const { update } = url;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextSearch = searchInput.trim();
      if (nextSearch !== search) update({ search: nextSearch, page: null });
    }, JOB_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput, search, update]);

  const togglePin = (jobId: number) => {
    setPinnedJobIds((current) => {
      const next = new Set(current);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  return {
    status,
    recruiter,
    search,
    searchInput,
    page,
    setSearchInput,
    setPage: (nextPage: number) => update({ page: nextPage }),
    updateStatus: (value: string) => update({ status: value, page: null }),
    updateRecruiter: (value: string) =>
      update({
        recruiter: value === ALL_RECRUITERS_VALUE ? '' : value,
        page: null,
      }),
    isPinned: (jobId: number) => pinnedJobIds.has(jobId),
    togglePin,
  };
}
