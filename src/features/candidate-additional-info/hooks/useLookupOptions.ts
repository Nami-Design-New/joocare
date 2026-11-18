'use client';

import useGetAvailabilities from '@/shared/hooks/useGetAvailabilities';
import useGetCountries from '@/shared/hooks/useGetCountries';
import useGetCurrencies from '@/shared/hooks/useGetCurrencies';
import useGetDomains from '@/shared/hooks/useGetDomains';
import useGetEducationLevels from '@/shared/hooks/useGetEducationLevels';
import useGetExperiences from '@/shared/hooks/useGetExperiences';
import useGetJobTitles from '@/shared/hooks/useGetJobTitles';
import useGetMandatoryCertifications from '@/shared/hooks/useGetMandatoryCertifications';
import useGetPrimaryLicenses from '@/shared/hooks/useGetPrimaryLicenses';
import useGetReligions from '@/shared/hooks/useGetReligions';
import { useInfiniteLookup } from '@/shared/hooks/useInfiniteLookup';
import type { EnumLookupEndpoint } from '../services/lookup-service';
import {
  type LookupFieldProps,
  toEnumLookupField,
  toLookupField,
} from '../utils/lookup-field';
import useGetEnumLookup from './useGetEnumLookup';
import useProfileCategoryId from './useProfileCategoryId';

// Lookup hooks for the select fields; each takes the field's search text.
export type LookupHook = (search: string) => LookupFieldProps;

// Fixed-choice lookups: one request, no search or paging.
function useEnumLookup(endpoint: EnumLookupEndpoint) {
  return toEnumLookupField(useGetEnumLookup(endpoint));
}

export const useGenderLookup: LookupHook = () => useEnumLookup('genders');
export const useLanguageLookup: LookupHook = () => useEnumLookup('languages');
export const useProficiencyLookup: LookupHook = () =>
  useEnumLookup('language-proficiency-levels');
export const useLicenseStatusLookup: LookupHook = () =>
  useEnumLookup('license-statuses');
export const useVerificationStatusLookup: LookupHook = () =>
  useEnumLookup('license-verification-statuses');
export const useMaritalStatusLookup: LookupHook = () =>
  useEnumLookup('marital-statuses');
export const useSponsorshipLookup: LookupHook = () =>
  useEnumLookup('sponsorship-requirements');
export const useVisaStatusLookup: LookupHook = () =>
  useEnumLookup('visa-statuses');

export const useCountryLookup: LookupHook = (search) => {
  const query = useGetCountries(search);
  return toLookupField(query, query.countries);
};

export const useDomainLookup: LookupHook = (search) => {
  const query = useGetDomains(search);
  return toLookupField(query, query.domains);
};

export const useJobTitleLookup: LookupHook = (search) => {
  const query = useGetJobTitles(search);
  return toLookupField(query, query.jobTitles);
};

export const useExperienceLookup: LookupHook = (search) => {
  const query = useGetExperiences(search);
  return toLookupField(query, query.experiences);
};

export const useEducationLevelLookup: LookupHook = (search) => {
  const query = useGetEducationLevels(search);
  return toLookupField(query, query.educationLevels);
};

export const useCertificationLookup: LookupHook = (search) => {
  const query = useGetMandatoryCertifications(search);
  return toLookupField(query, query.mandatoryCertifications);
};

export const usePrimaryLicenseLookup: LookupHook = (search) => {
  const query = useGetPrimaryLicenses(search);
  return toLookupField(query, query.primaryLicenses);
};

export const useReligionLookup: LookupHook = (search) => {
  const query = useGetReligions(search);
  return toLookupField(query, query.religions);
};

export const useAvailabilityLookup: LookupHook = (search) => {
  const query = useGetAvailabilities(search);
  return toLookupField(query, query.availabilities);
};

// Currencies are shown by code (USD, SAR, ...).
export const useCurrencyLookup: LookupHook = (search) => {
  const query = useGetCurrencies(search);
  return toLookupField(query, query.currencies, (items) =>
    items.map((item) => ({
      value: String(item.id),
      label: String((item as { code?: string }).code ?? item.title ?? ''),
    })),
  );
};

// Levels are filtered by the category chosen in Basic info.
export const useSeniorityLookup: LookupHook = (search) => {
  const { categoryId, isPending } = useProfileCategoryId();
  const query = useInfiniteLookup({
    endpoint: 'seniority-levels',
    queryKey: 'seniority-levels',
    search,
    limitPerPage: 100,
    extraParams: { category_id: categoryId },
    enabled: !isPending,
  });
  return toLookupField(
    query,
    query.data?.pages.flatMap((page) => page.data) ?? [],
  );
};
