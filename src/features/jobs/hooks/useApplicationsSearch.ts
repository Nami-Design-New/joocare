'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { JOB_SEARCH_DEBOUNCE_MS } from '../constants';

// Applied jobs title search, kept in the URL (`?search=`) after a short debounce.
export function useApplicationsSearch(search: string) {
  const [value, setValue] = useState(search);
  const [urlSearch, setUrlSearch] = useState(search);
  // Last search this field pushed to the URL.
  const [pushedSearch, setPushedSearch] = useState(search);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  // Follow URL changes made elsewhere (back / forward), but never overwrite
  // what the user typed while their own search was loading.
  if (urlSearch !== search) {
    setUrlSearch(search);
    if (search !== pushedSearch) setValue(search);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextSearch = value.trim();
      if (nextSearch === search) return;
      const params = new URLSearchParams({ tab: 'applied' });
      if (nextSearch) params.set('search', nextSearch);
      setPushedSearch(nextSearch);
      startTransition(() =>
        router.replace(`${pathname}?${params}`, { scroll: false }),
      );
    }, JOB_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [value, search, router, pathname]);

  return { value, setValue, pending };
}
