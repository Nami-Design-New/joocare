'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CATEGORY_QUERY_PREFIXES } from '../constants/assessment-queries';
import { saveAssessmentCategory } from '../services/assessment-categories-service';
import type { CategoryFormValues } from '../types/assessment.types';
import { useAssessmentRequestOptions } from './useAssessmentRequestOptions';

type SaveCategoryVariables = {
  categoryId: string | null;
  values: CategoryFormValues;
};

export function useSaveAssessmentCategory() {
  const t = useTranslations('companyPage.assessments');
  const queryClient = useQueryClient();
  const { token, locale } = useAssessmentRequestOptions();

  return useMutation({
    mutationFn: ({ categoryId, values }: SaveCategoryVariables) =>
      saveAssessmentCategory(categoryId, values, { token, locale }),
    onSuccess: async (_data, { categoryId }) => {
      toast.success(t(categoryId ? 'category-updated' : 'category-created'));
      await Promise.all(
        CATEGORY_QUERY_PREFIXES.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('save-error'));
    },
  });
}
