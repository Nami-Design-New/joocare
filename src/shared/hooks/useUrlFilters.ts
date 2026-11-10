'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type FilterPatch = Record<string, string | number | null | undefined>;

// Keeps list filters in the URL so they can be shared and opened from other pages.
// Uses the native History API (supported by Next.js) to avoid a server round-trip per change.
export function useUrlFilters() {
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string) => searchParams.get(key) ?? '',
    [searchParams],
  );

  const getPage = useCallback(() => {
    const page = Number(searchParams.get('page'));
    return Number.isInteger(page) && page > 1 ? page : 1;
  }, [searchParams]);

  const update = useCallback(
    (patch: FilterPatch) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        const isDefault =
          value === undefined ||
          value === null ||
          value === '' ||
          (key === 'page' && Number(value) <= 1);
        if (isDefault) next.delete(key);
        else next.set(key, String(value));
      });
      const query = next.toString();
      const { pathname } = window.location;
      window.history.replaceState(
        null,
        '',
        query ? `${pathname}?${query}` : pathname,
      );
    },
    [searchParams],
  );

  return { get, getPage, update };
}
