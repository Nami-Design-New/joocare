'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  CompanyJobStatus,
  updateCompanyJobStatusService,
} from '../services/company-job-status-service';

type UseUpdateCompanyJobStatusOptions = {
  onSuccess?: (status: CompanyJobStatus) => void;
  showSuccessToast?: boolean | ((status: CompanyJobStatus) => boolean);
};

export function useUpdateCompanyJobStatus(
  jobId: number | string | undefined,
  options: UseUpdateCompanyJobStatusOptions = {},
) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const { onSuccess, showSuccessToast = true } = options;

  const mutation = useMutation({
    mutationFn: async (status: CompanyJobStatus) => {
      if (!jobId) {
        throw new Error('Job id is missing.');
      }

      if (!session?.accessToken || session.authRole !== 'employer') {
        throw new Error('Only company accounts can change job status.');
      }

      return updateCompanyJobStatusService({
        jobId,
        status,
        token: session.accessToken,
        locale,
      });
    },
    onSuccess: (response, status) => {
      const shouldToast =
        typeof showSuccessToast === 'function'
          ? showSuccessToast(status)
          : showSuccessToast;
      if (shouldToast)
        toast.success(response.message || `Job status updated to ${status}.`);
      void queryClient.invalidateQueries({ queryKey: ['company-jobs'] });
      void queryClient.invalidateQueries({
        queryKey: ['company-job', locale, jobId],
      });
      router.refresh();
      onSuccess?.(status);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update job status.');
    },
  });

  return {
    updateStatus: mutation.mutate,
    isPending: mutation.isPending,
  };
}
