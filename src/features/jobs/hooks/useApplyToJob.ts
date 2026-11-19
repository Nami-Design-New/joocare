import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { useRouter } from '@/i18n/navigation';
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
  const queryClient = useQueryClient();
  const router = useRouter();
  const inFlight = useRef(false);

  const mutation = useMutation({
    mutationFn: ({ cvPath, answers }: ApplyToJobVariables) => {
      if (!session?.accessToken || session.authRole !== 'candidate') {
        throw new Error(t('only-candidates'));
      }
      return applyToJobService({
        jobId,
        cvPath,
        answers,
        token: session?.accessToken ?? '',
        locale,
        invalidAnswers: t('invalid-answers'),
      });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ['shared-company-profile-jobs'],
      });
      toast.success(response.message || t('application-submitted'));
      onApplied();
      // Details and applications are server rendered; refresh their props once.
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : t('failed-submit-application'),
      );
    },
  });
  const submit = (variables: ApplyToJobVariables) => {
    if (inFlight.current) return;
    inFlight.current = true;
    mutation.mutate(variables, {
      onSettled: () => {
        inFlight.current = false;
      },
    });
  };
  return { isPending: mutation.isPending, submit };
}
