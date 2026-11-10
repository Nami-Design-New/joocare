'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { PROFILE_INSIGHTS_ROUTES } from '../constants';
import { buildProfileInsightsQuery } from '../utils/profile-viewers';

// Company-name search box: submitting puts the term in the URL (`?search=`) and resets the page.
export function useProfileViewersSearch(search: string) {
  const [value, setValue] = useState(search);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const submit = () => {
    const query = buildProfileInsightsQuery({ search: value.trim(), page: 1 });
    startTransition(() =>
      router.push(`${PROFILE_INSIGHTS_ROUTES.root}${query}`, { scroll: false }),
    );
  };

  return { value, setValue, pending, submit };
}
