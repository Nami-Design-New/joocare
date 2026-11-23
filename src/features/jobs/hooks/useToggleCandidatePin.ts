'use client';

import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { toggleCandidatePin } from '../services/candidate-pin-service';
import { PINNED_CANDIDATES_QUERY_KEY } from './useGetPinnedCandidateIds';

export function useToggleCandidatePin() {
  const t = useTranslations('companyPage.candidates.pipeline');
  const locale = useLocale();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  // The endpoint toggles, so a second click before the first ends would undo it.
  const inFlight = useRef(false);

  const mutation = useMutation({
    mutationFn: (userId: string) =>
      toggleCandidatePin(userId, { token: session?.accessToken ?? '', locale }),
    onSuccess: (isPinned, userId) => {
      // Update the cached pinned ids with the state the API returned.
      queryClient.setQueryData<string[]>(
        [PINNED_CANDIDATES_QUERY_KEY, locale],
        (current = []) =>
          isPinned
            ? [...new Set([...current, userId])]
            : current.filter((id) => id !== userId),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('star-error'));
    },
  });

  const toggle = (userId: string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    mutation.mutate(userId, {
      onSettled: () => {
        inFlight.current = false;
      },
    });
  };

  return { isPending: mutation.isPending, toggle };
}
