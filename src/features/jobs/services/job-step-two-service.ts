import { apiFetch } from '@/shared/lib/fetch-manager';
import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { JobStepTwoPayload } from '../types/job-steps.types';
import { appendScreeningQuestions } from './screening-questions-mapper';

// Used when creating a job and when editing it (draft or published).
export async function jobStepTwoService(
  jobId: number | string,
  payload: JobStepTwoPayload,
  { token, locale }: { token: string; locale: string },
) {
  const formData = new FormData();
  formData.append('description', payload.description);
  payload.skills.forEach((skillId, index) => {
    formData.append(`skills[${index}]`, String(skillId));
  });
  appendScreeningQuestions(formData, payload.questions);

  const response = await apiFetch(
    `${getCompanyApiUrl()}/jobs-step-two/${jobId}`,
    {
      method: 'POST',
      body: formData,
      token,
      locale,
    },
  );
  if (!response.ok) {
    throw new Error(response.message ?? '');
  }

  return response;
}
