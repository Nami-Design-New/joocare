'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { JobStatus } from '../types/index.types';
import { useDeleteCompanyJob } from './useDeleteCompanyJob';
import { useUpdateCompanyJobStatus } from './useUpdateCompanyJobStatus';

export type JobStatusAction = 'pause' | 'resume' | 'close' | 'delete';
export type JobStatusSuccess = 'closed' | 'resumed';
export type JobStatusTarget = { id: number | string; status: JobStatus };

type UseJobStatusActionsOptions = {
  deleteRedirectTo?: string;
};

// One set of status modals per page; the card or button that opens them passes its job.
export function useJobStatusActions({
  deleteRedirectTo,
}: UseJobStatusActionsOptions = {}) {
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<JobStatusTarget | null>(null);
  const [action, setAction] = useState<JobStatusAction | null>(null);
  const [success, setSuccess] = useState<JobStatusSuccess | null>(null);

  const statusMutation = useUpdateCompanyJobStatus(target?.id, {
    // Pause has no success modal in Figma, so it keeps the toast.
    showSuccessToast: (status) => status === 'paused',
    onSuccess: (status) => {
      setAction(null);
      if (status === 'closed') setSuccess('closed');
      if (status === 'open') setSuccess('resumed');
    },
  });
  const deleteMutation = useDeleteCompanyJob(target?.id, {
    redirectTo: deleteRedirectTo,
    onSuccess: () => {
      setAction(null);
      void queryClient.invalidateQueries({ queryKey: ['company-profile'] });
    },
  });

  const confirm = () => {
    if (action === 'pause') statusMutation.updateStatus('paused');
    if (action === 'resume') statusMutation.updateStatus('open');
    if (action === 'close') statusMutation.updateStatus('closed');
    if (action === 'delete') deleteMutation.deleteJob();
  };

  return {
    target,
    action,
    success,
    open: (nextAction: JobStatusAction, job: JobStatusTarget) => {
      setTarget(job);
      setAction(nextAction);
    },
    closeAction: () => setAction(null),
    closeSuccess: () => setSuccess(null),
    confirm,
    isPending: statusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export type JobStatusActions = ReturnType<typeof useJobStatusActions>;
