import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { ProfileDetails } from '../types/profile-details.types';

export async function getProfileDetailsService({
  token,
  locale,
}: {
  token: string;
  locale: string;
}): Promise<ProfileDetails> {
  const result = await apiFetch<ProfileDetails>(
    `${getUserApiUrl()}/profile-details`,
    { locale, token, cache: 'no-store' },
  );

  if (!result.ok || !result.data?.data) {
    throw new Error(result.message || 'Failed to load profile details.');
  }

  return result.data.data;
}

// Returns the saved profile details.
export async function saveProfileDetailsService({
  token,
  locale,
  body,
}: {
  token: string;
  locale: string;
  body: FormData;
}): Promise<ProfileDetails> {
  const result = await apiFetch<ProfileDetails>(
    `${getUserApiUrl()}/profile-details`,
    { method: 'POST', locale, token, body, cache: 'no-store' },
  );

  if (!result.ok || !result.data?.data) {
    throw new Error(result.message || 'Failed to save profile details.');
  }

  return result.data.data;
}
