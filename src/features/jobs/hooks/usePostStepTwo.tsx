import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { jobStepTwoService } from '../services/job-step-two-service';
import { JobStepTwoPayload } from '../types/job-steps.types';
import { QUESTION_TEMPLATE_HINTS_QUERY_KEY } from '../constants';

export const usePostStepTwo = ({ token }: { token: string }) => {
  const locale = useLocale();
  const t = useTranslations('companyPage.postJob.questions');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: number | string;
      payload: JobStepTwoPayload;
    }) => jobStepTwoService(jobId, payload, { token, locale }),
    onSuccess: async (res, { jobId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['company-job'] }),
        queryClient.invalidateQueries({ queryKey: ['company-jobs'] }),
        queryClient.invalidateQueries({
          queryKey: [QUESTION_TEMPLATE_HINTS_QUERY_KEY, locale, String(jobId)],
        }),
      ]);
      toast.success(res.message || t('save-success'));
    },
    onError: (error) => {
      toast.error(error.message || t('save-error'));
    },
  });
};
