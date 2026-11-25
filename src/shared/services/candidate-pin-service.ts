import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';

type RequestOptions = { token: string; locale: string };

// The pinned list is the only source of a candidate's star state for now.
const PINNED_CANDIDATES_LIMIT = 100;

export async function getPinnedCandidateIds({
  token,
  locale,
}: RequestOptions): Promise<string[]> {
  const { ok, data, message } = await apiFetch<{ id: number }[]>(
    `${getCompanyApiUrl()}/candidates/pinned?pagination=on&limit_per_page=${PINNED_CANDIDATES_LIMIT}&page=1`,
    { token, locale, cache: 'no-store' },
  );
  if (!ok) throw new Error(message ?? '');
  return (data?.data ?? []).map((candidate) => String(candidate.id));
}

// Toggles the star; the API answers with the new state.
export async function toggleCandidatePin(
  userId: string,
  { token, locale }: RequestOptions,
): Promise<boolean> {
  const { ok, data, message } = await apiFetch<{ is_pinned: boolean }>(
    `${getCompanyApiUrl()}/candidates/${encodeURIComponent(userId)}/pin`,
    { method: 'POST', token, locale, body: new FormData() },
  );
  if (!ok || !data?.data) throw new Error(message ?? '');
  return data.data.is_pinned;
}
