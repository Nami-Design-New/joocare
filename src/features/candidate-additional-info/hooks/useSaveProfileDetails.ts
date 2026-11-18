'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { saveProfileDetailsService } from '../services/profile-details-service';
import { profileDetailsQueryKey } from './useGetProfileDetails';

export default function useSaveProfileDetails() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';

  return useMutation({
    mutationFn: (body: FormData) =>
      saveProfileDetailsService({ token, locale, body }),
    onSuccess: (details) => {
      queryClient.setQueryData(profileDetailsQueryKey(locale), details);
      // Country, city and readiness score are also shown on the profile.
      void queryClient.invalidateQueries({ queryKey: ['candidate-profile'] });
    },
  });
}
