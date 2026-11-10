import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { applyToJobService } from '../services/apply-job-service';
import type { ScreeningAnswer } from '../types/job-apply.types';

type ApplyToJobVariables = {
  cvPath: string | null;
  answers?: ScreeningAnswer[];
};

export function useApplyToJob(jobId: number, onApplied: () => void) {
  const t = useTranslations('jobDetailsPage.toasts');
  const locale = useLocale();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ cvPath, answers }: ApplyToJobVariables) =>
      applyToJobService({
        jobId,
        cvPath,
        answers,
        token: session?.accessToken ?? '',
        locale,
      }),
    onSuccess: (response) => {
      toast.success(response.message ?? t('application-submitted'));
      onApplied();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t('failed-submit-application'),
      );
    },
  });
}
