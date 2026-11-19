'use client';

import { useCallback, useRef } from 'react';
import { OTHER_OPTION_VALUE } from '../constants';
import type { JobStepTwoPayload } from '../types/job-steps.types';
import type { JobFormData } from '../validation/job-post-schema';
import { usePostStepTwo } from './usePostStepTwo';

function toPayload(data: JobFormData): JobStepTwoPayload {
  return {
    description: data.description,
    skills: data.title === OTHER_OPTION_VALUE ? [] : data.skills.map(Number),
    questions: data.screeningQuestions,
  };
}

// Step two replaces every question on the server. Only resend changed content.
export function usePersistJobStepTwo(token: string) {
  const savedContent = useRef<{ jobId: string; signature: string } | null>(
    null,
  );
  const mutation = usePostStepTwo({ token });
  const markSaved = useCallback((jobId: number | string, data: JobFormData) => {
    savedContent.current = {
      jobId: String(jobId),
      signature: JSON.stringify(toPayload(data)),
    };
  }, []);

  const persist = async (jobId: number | string, data: JobFormData) => {
    const payload = toPayload(data);
    const signature = JSON.stringify(payload);
    if (
      savedContent.current?.jobId === String(jobId) &&
      savedContent.current.signature === signature
    )
      return null;

    const response = await mutation.mutateAsync({ jobId, payload });
    savedContent.current = { jobId: String(jobId), signature };
    return response;
  };

  return { persist, markSaved, isPending: mutation.isPending };
}
