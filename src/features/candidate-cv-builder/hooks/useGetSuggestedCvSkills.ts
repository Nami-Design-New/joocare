'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { getSuggestedCvSkillsService } from '../services/cv-builder-service';

export function useGetSuggestedCvSkills() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ['cv-suggested-skills', locale, session?.user?.id],
    enabled: Boolean(token),
    queryFn: () => getSuggestedCvSkillsService({ locale, token: token ?? '' }),
  });
}
