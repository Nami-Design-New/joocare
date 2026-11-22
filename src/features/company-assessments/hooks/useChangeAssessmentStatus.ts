'use client';

import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ASSESSMENT_QUERY_PREFIXES } from '../constants/assessment-queries';
import { changeAssessmentStatus } from '../services/assessments-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

type ChangeAssessmentStatusVariables = {
  assessmentId: string;
  /** Current state, used to pick the success message. */
  isPaused: boolean;
};

// Pauses an active assessment or resumes a paused one. The endpoint toggles,
// so a second request would undo the first: `toggle` sends one at a time.
export function useChangeAssessmentStatus() {
  const t = useTranslations('companyPage.assessments');
  const queryClient = useQueryClient();
  const { token, locale } = useAssessmentRequestOptions();
  const inFlight = useRef(false);

  const mutation = useMutation({
    mutationFn: ({ assessmentId }: ChangeAssessmentStatusVariables) =>
      changeAssessmentStatus(assessmentId, { token, locale }),
    onSuccess: async (_, { isPaused }) => {
      toast.success(t(isPaused ? 'assessment-resumed' : 'assessment-paused'));
      await Promise.all(
        ASSESSMENT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('status-change-error'));
    },
  });

  const toggle = (
    variables: ChangeAssessmentStatusVariables,
    onDone?: () => void,
  ) => {
    if (inFlight.current) return;
    inFlight.current = true;
    mutation.mutate(variables, {
      onSuccess: () => onDone?.(),
      onSettled: () => {
        inFlight.current = false;
      },
    });
  };

  return { isPending: mutation.isPending, toggle };
}
