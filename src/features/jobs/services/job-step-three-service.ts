import { apiFetch } from '@/shared/lib/fetch-manager';
import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { JobStepThreePayload } from '../types/job-steps.types';

export async function jobStepThreeService(
  jobId: number,
  payload: JobStepThreePayload,
  { token, locale }: { token: string; locale: string },
) {
  const body = new FormData();
  body.append('status', payload.status);
  const response = await apiFetch(
    `${getCompanyApiUrl()}/jobs-step-three/${jobId}`,
    {
      method: 'POST',
      body,
      token,
      locale,
    },
  );

  if (!response.ok) {
    throw new Error(response.message ?? '');
  }

  return response;
}
