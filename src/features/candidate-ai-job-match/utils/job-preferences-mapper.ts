import type {
  ApiJobPreferences,
  ApiPreferenceLookup,
  ApiPreferenceReference,
  JobPreferenceOption,
  JobPreferences,
} from '../types/ai-job-match.types';

const toStringIds = (
  values: Array<number | string | ApiPreferenceReference> | null | undefined,
) =>
  values?.map((value) =>
    String(typeof value === 'object' ? value.id : value),
  ) ?? [];

const toBoolean = (value: ApiJobPreferences['is_only_high']) =>
  value === true || value === 1 || value === '1';

function toPreferenceOption(
  value: ApiPreferenceLookup | null | undefined,
): JobPreferenceOption | null {
  const label = value?.title ?? value?.name;
  if (!value || !label) return null;

  return { value: String(value.id), label };
}

function toPreferenceOptions(
  values: ApiPreferenceReference[] | null | undefined,
  key: 'domain' | 'job_title' | 'company' | 'seniority_level',
): JobPreferenceOption[] {
  return (values ?? []).flatMap((value) => {
    const nestedValue = value[key];
    if (!nestedValue || typeof nestedValue !== 'object') return [];
    const option = toPreferenceOption(nestedValue);
    return option ? [option] : [];
  });
}

export function toJobPreferences(api: ApiJobPreferences): JobPreferences {
  const domainOptions = toPreferenceOptions(api.domains, 'domain');
  const jobTitleOptions = toPreferenceOptions(api.job_titles, 'job_title');
  const companyOptions = toPreferenceOptions(api.companies, 'company');
  const seniorityLevelOptions = toPreferenceOptions(
    api.seniority_levels,
    'seniority_level',
  );

  return {
    domainIds: api.domain_ids
      ? toStringIds(api.domain_ids)
      : domainOptions.map((option) => option.value),
    jobFunction: api.job_function ?? '',
    jobTitleIds: api.job_title_ids
      ? toStringIds(api.job_title_ids)
      : jobTitleOptions.map((option) => option.value),
    jobTitleOptions,
    companyIds: api.company_ids
      ? toStringIds(api.company_ids)
      : companyOptions.map((option) => option.value),
    companyOptions,
    countryId: api.country_id
      ? String(api.country_id)
      : api.country
        ? String(api.country.id)
        : '',
    countryOption: toPreferenceOption(api.country),
    seniorityLevelIds: api.seniority_level_ids
      ? toStringIds(api.seniority_level_ids)
      : seniorityLevelOptions.map((option) => option.value),
    highMatchOnly: toBoolean(api.is_only_high),
  };
}

export function toApiJobPreferences(preferences: JobPreferences) {
  return {
    job_function: preferences.jobFunction || null,
    country_id: preferences.countryId ? Number(preferences.countryId) : null,
    is_only_high: Number(preferences.highMatchOnly),
    domain_ids: preferences.domainIds.map(Number),
    job_title_ids: preferences.jobTitleIds.map(Number),
    company_ids: preferences.companyIds.map(Number),
    seniority_level_ids: preferences.seniorityLevelIds.map(Number),
  };
}
