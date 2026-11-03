'use client';

import { useEffect, useState } from 'react';
import { ALL_RECRUITERS_VALUE, JOB_SEARCH_DEBOUNCE_MS } from '../constants';

// Search and recruiter are sent to the jobs endpoint; pins stay local until the API supports them.
export function useJobListingPreview() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [recruiter, setRecruiter] = useState('');
  const [pinnedJobIds, setPinnedJobIds] = useState<Set<number>>(
    () => new Set(),
  );

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search.trim()),
      JOB_SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [search]);

  const updateRecruiter = (value: string) => {
    setRecruiter(value === ALL_RECRUITERS_VALUE ? '' : value);
  };

  const togglePin = (jobId: number) => {
    setPinnedJobIds((current) => {
      const next = new Set(current);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  return {
    search,
    debouncedSearch,
    recruiter,
    setSearch,
    updateRecruiter,
    isPinned: (jobId: number) => pinnedJobIds.has(jobId),
    togglePin,
  };
}
