import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import { jobStepThreeService } from '../services/job-step-three-service';
import { JobStepThreePayload } from '../types/job-steps.types';

export const usePostStepThree = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const t = useTranslations('companyPage.postJob');
  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: number;
      payload: JobStepThreePayload;
    }) => jobStepThreeService(jobId, payload, { token, locale }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['company-jobs'] }),
        queryClient.invalidateQueries({ queryKey: ['company-job'] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message || t('save-status-error'));
    },
  });
};
