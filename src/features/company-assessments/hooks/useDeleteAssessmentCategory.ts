'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CATEGORY_QUERY_PREFIXES } from '../constants/assessment-queries';
import { deleteAssessmentCategory } from '../services/assessment-categories-service';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

export function useDeleteAssessmentCategory() {
  const t = useTranslations('companyPage.assessments');
  const queryClient = useQueryClient();
  const { token, locale } = useAssessmentRequestOptions();

  return useMutation({
    mutationFn: (categoryId: string) =>
      deleteAssessmentCategory(categoryId, { token, locale }),
    onSuccess: async () => {
      toast.success(t('category-deleted'));
      await Promise.all(
        CATEGORY_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('delete-error'));
    },
  });
}
