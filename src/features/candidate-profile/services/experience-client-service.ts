import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { ExperiencePayload } from '../types/profile.types';

function appendIfPresent(formData: FormData, key: string, value?: string) {
  if (value) {
    formData.append(key, value);
  }
}

function buildExperienceFormData(
  payload: ExperiencePayload,
  includeMethodOverride = false,
) {
  const formData = new FormData();

  appendIfPresent(formData, 'job_title_id', payload.jobTitleId);
  appendIfPresent(formData, 'title', payload.title);
  formData.append('company', payload.company);
  appendIfPresent(formData, 'employment_type_id', payload.employmentTypeId);
  appendIfPresent(formData, 'country_id', payload.countryId);
  appendIfPresent(formData, 'city_id', payload.cityId);
  formData.append('start_date', payload.startDate);
  formData.append('is_current', payload.isCurrent ? '1' : '0');

  if (!payload.isCurrent) {
    appendIfPresent(formData, 'end_date', payload.endDate);
  }

  payload.responsibilities.forEach((responsibility) => {
    formData.append('responsibilities[]', responsibility);
  });

  if (includeMethodOverride) {
    formData.append('_method', 'put');
  }

  return formData;
}

export async function createExperience(payload: ExperiencePayload) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/user-experiences`,
    {
      method: 'POST',
      locale: payload.locale,
      token: payload.token,
      body: buildExperienceFormData(payload),
    },
  );

  if (!ok) {
    throw new Error(message || 'Failed to add experience.');
  }

  return data;
}

export async function updateExperience(id: string, payload: ExperiencePayload) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/user-experiences/${id}`,
    {
      method: 'POST',
      locale: payload.locale,
      token: payload.token,
      body: buildExperienceFormData(payload, true),
    },
  );

  if (!ok) {
    throw new Error(message || 'Failed to update experience.');
  }

  return data;
}

export async function deleteExperience({
  id,
  locale = 'en',
  token,
}: {
  id: string;
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/user-experiences/${id}`,
    {
      method: 'DELETE',
      locale,
      token,
      body: new FormData(),
    },
  );

  if (!ok) {
    throw new Error(message || 'Failed to delete experience.');
  }

  return data;
}
