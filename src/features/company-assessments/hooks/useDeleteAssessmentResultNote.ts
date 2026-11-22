'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { RESULT_QUERY_PREFIXES } from '../constants/assessment-queries';
import { deleteResultNote } from '../services/assessment-results-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useDeleteAssessmentResultNote() {
  const t = useTranslations('companyPage.assessments.answers');
  const queryClient = useQueryClient();
  const { token, locale } = useAssessmentRequestOptions();

  return useMutation({
    mutationFn: (noteId: string) => deleteResultNote(noteId, { token, locale }),
    onSuccess: async () => {
      toast.success(t('note-deleted'));
      await Promise.all(
        RESULT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('note-delete-error'));
    },
  });
}
