'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { saveCvBuilderStepService } from '../services/cv-builder-service';
import type { CvBuilderValues } from '../types/cv-builder.types';
import {
  CvStepPayloadError,
  buildCvStepPayload,
} from '../utils/cv-step-payloads';

type SaveStepInput = { step: number; values: CvBuilderValues };

export function useSaveCvBuilderStep() {
  const locale = useLocale();
  const t = useTranslations('candidatePage.buildCv');
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ step, values }: SaveStepInput) => {
      if (!session?.accessToken)
        throw new Error(t('save-errors.session-expired'));
      return saveCvBuilderStepService({
        locale,
        token: session.accessToken,
        step,
        payload: buildCvStepPayload(step, values),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['candidate-cv-builder', locale],
      });
      toast.success(t('save-success'));
    },
    onError: (error) => {
      toast.error(
        error instanceof CvStepPayloadError
          ? t('save-errors.invalid-selection')
          : error instanceof Error && error.message
            ? error.message
            : t('save-errors.generic'),
      );
    },
  });
}
