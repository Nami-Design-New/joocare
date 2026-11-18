import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type {
  ApiJobPreferences,
  ApiJobPreferencesResponse,
  JobPreferences,
} from '../types/ai-job-match.types';
import {
  toApiJobPreferences,
  toJobPreferences,
} from '../utils/job-preferences-mapper';

type RequestOptions = {
  locale: string;
  token: string;
};

function isPreferencesEnvelope(
  data: ApiJobPreferencesResponse,
): data is { preference?: ApiJobPreferences } {
  return !Array.isArray(data) && 'preference' in data;
}

function getPreference(
  data: ApiJobPreferencesResponse | undefined,
): ApiJobPreferences | null {
  if (!data || Array.isArray(data)) return null;
  if (isPreferencesEnvelope(data)) return data.preference ?? null;
  return data;
}

export async function getJobPreferencesService({
  locale,
  token,
}: RequestOptions): Promise<JobPreferences | null> {
  const result = await apiFetch<ApiJobPreferencesResponse>(
    `${getUserApiUrl()}/preferences`,
    { locale, token, cache: 'no-store' },
  );

  if (result.statusCode === 404 && Array.isArray(result.data?.data)) {
    return null;
  }

  const preference = getPreference(result.data?.data);
  if (!result.ok || !preference) {
    throw new Error(result.message ?? '');
  }

  return toJobPreferences(preference);
}

export async function saveJobPreferencesService(
  preferences: JobPreferences,
  { locale, token }: RequestOptions,
): Promise<JobPreferences> {
  const result = await apiFetch<ApiJobPreferencesResponse>(
    `${getUserApiUrl()}/preferences`,
    {
      method: 'POST',
      locale,
      token,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toApiJobPreferences(preferences)),
      cache: 'no-store',
    },
  );

  const savedPreference = getPreference(result.data?.data);
  if (!result.ok || !savedPreference) {
    throw new Error(result.message ?? '');
  }

  return toJobPreferences(savedPreference);
}
