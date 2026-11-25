import type { Option } from '@/shared/components/SelectInputField';
import { getBaseApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';

// Fixed-choice lookups that return `[{ value, label }]` without pagination.
export type EnumLookupEndpoint =
  | 'genders'
  | 'job-search-statuses'
  | 'languages'
  | 'language-proficiency-levels'
  | 'last-active-options'
  | 'license-statuses'
  | 'license-verification-statuses'
  | 'marital-statuses'
  | 'sponsorship-requirements'
  | 'visa-statuses';

function toEnumOption(item: unknown): Option[] {
  if (typeof item !== 'object' || item === null) return [];
  if (!('value' in item) || !('label' in item)) return [];
  const { value, label } = item;
  if (typeof label !== 'string') return [];
  if (typeof value !== 'string' && typeof value !== 'number') return [];
  return [{ value: String(value), label }];
}

export async function getEnumLookupService({
  endpoint,
  locale,
}: {
  endpoint: EnumLookupEndpoint;
  locale: string;
}): Promise<Option[]> {
  const result = await apiFetch<unknown>(`${getBaseApiUrl()}/${endpoint}`, {
    locale,
  });

  if (!result.ok) {
    throw new Error(result.message || 'Failed to load options.');
  }

  const items = result.data?.data;
  return Array.isArray(items) ? items.flatMap(toEnumOption) : [];
}
