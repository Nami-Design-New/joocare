'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { RESULT_QUERY_PREFIXES } from '../constants/assessment-queries';
import { saveResultNote } from '../services/assessment-results-service';
import type { SaveResultNotePayload } from '../types/assessment-results.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useSaveAssessmentResultNote() {
  const t = useTranslations('companyPage.assessments.answers');
  const queryClient = useQueryClient();
  const { token, locale } = useAssessmentRequestOptions();

  return useMutation({
    mutationFn: (payload: SaveResultNotePayload) =>
      saveResultNote(payload, { token, locale }),
    onSuccess: async (_, payload) => {
      toast.success(t(payload.noteId ? 'note-updated' : 'note-added'));
      await Promise.all(
        RESULT_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('note-save-error'));
    },
  });
}
