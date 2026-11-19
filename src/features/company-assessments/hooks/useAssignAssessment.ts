'use client';

import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ASSESSMENT_QUERY_PREFIXES } from '../constants/assessment-queries';
import { assignAssessment } from '../services/assessment-assignment-service';
import type { AssessmentAssignmentPayload } from '../types/assessment-invitation.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useAssignAssessment(onAssigned: () => void) {
  const t = useTranslations('companyPage.assessments.assignment');
  const { token, locale } = useAssessmentRequestOptions();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const inFlight = useRef(false);
  const mutation = useMutation({
    mutationFn: (payload: AssessmentAssignmentPayload) => {
      if (!token || session?.authRole !== 'employer')
        throw new Error(t('assign-error'));
      return assignAssessment(
        payload,
        { token, locale },
        t('invalid-recipients'),
      );
    },
    onSuccess: async () => {
      await Promise.all(
        ASSESSMENT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
      onAssigned();
    },
    onError: (error: Error) => toast.error(error.message || t('assign-error')),
  });
  return {
    isPending: mutation.isPending,
    reset: mutation.reset,
    assign: (payload: AssessmentAssignmentPayload) => {
      if (inFlight.current) return;
      inFlight.current = true;
      mutation.mutate(payload, {
        onSettled: () => {
          inFlight.current = false;
        },
      });
    },
  };
}
