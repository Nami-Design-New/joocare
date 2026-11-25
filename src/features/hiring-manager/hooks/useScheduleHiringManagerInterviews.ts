'use client';

import { useMutation } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import { scheduleHiringManagerInterviews } from '../services/hiring-manager-review-service';
import type {
  HiringManagerInterview,
  HiringManagerReviewAccess,
} from '../types/hiring-manager-review.types';

export function useScheduleHiringManagerInterviews({
  projectId,
  token,
}: HiringManagerReviewAccess) {
  const locale = useLocale();
  const t = useTranslations('companyPage.projects.shared-review');

  return useMutation({
    mutationFn: (interviews: HiringManagerInterview[]) =>
      scheduleHiringManagerInterviews({ projectId, token, locale }, interviews),
    retry: false,
    onError: (error) => {
      if (getHttpStatusCode(error) !== 401)
        toast.error(t('interviews-save-error'));
    },
  });
}
