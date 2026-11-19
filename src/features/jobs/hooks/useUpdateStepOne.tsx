import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { JobStepOnePayload } from '../types/job-steps.types';
import { jobUpdateStepOneService } from '../services/job-update-step-one-service';

type UpdateStepOneParams = {
  jobId: number | string;
  payload: JobStepOnePayload;
};

export const useUpdateStepOne = ({ token }: { token: string }) => {
  const locale = useLocale();
  const t = useTranslations('companyPage.postJob');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, payload }: UpdateStepOneParams) =>
      jobUpdateStepOneService(jobId, payload, { token, locale }),
    onSuccess: async (res) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['company-job'] }),
        queryClient.invalidateQueries({ queryKey: ['company-jobs'] }),
      ]);
      toast.success(res.message || t('update-success'));
    },
    onError: (error) => {
      toast.error(error.message || t('update-error'));
    },
  });
};
