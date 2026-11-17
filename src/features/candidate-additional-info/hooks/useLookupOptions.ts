'use client';

import useGetAvailabilities from '@/shared/hooks/useGetAvailabilities';
import useGetCountries from '@/shared/hooks/useGetCountries';
import useGetCurrencies from '@/shared/hooks/useGetCurrencies';
import useGetDomains from '@/shared/hooks/useGetDomains';
import useGetEducationLevels from '@/shared/hooks/useGetEducationLevels';
import useGetExperiences from '@/shared/hooks/useGetExperiences';
import useGetJobTitles from '@/shared/hooks/useGetJobTitles';
import useGetLicenses from '@/shared/hooks/useGetLicenses';
import useGetMandatoryCertifications from '@/shared/hooks/useGetMandatoryCertifications';
import { useInfiniteLookup } from '@/shared/hooks/useInfiniteLookup';
import type { EnumLookupEndpoint } from '../services/lookup-service';
import {
  type LookupFieldProps,
  toEnumLookupField,
  toLookupField,
} from '../utils/lookup-field';
import useGetEnumLookup from './useGetEnumLookup';

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

export const useLicenseLookup: LookupHook = (search) => {
  const query = useGetLicenses(search);
  return toLookupField(query, query.licenses);
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

// Levels depend on the Basic info category, but the profile API doesn't return
// one yet, so every level is shown.
export const useSeniorityLookup: LookupHook = (search) => {
  const query = useInfiniteLookup({
    endpoint: 'seniority-levels',
    queryKey: 'seniority-levels',
    search,
    limitPerPage: 100,
  });
  return toLookupField(
    query,
    query.data?.pages.flatMap((page) => page.data) ?? [],
  );
};
