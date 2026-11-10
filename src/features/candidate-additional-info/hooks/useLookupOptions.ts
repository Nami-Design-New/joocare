'use client';

import useGetAvailabilities from '@/shared/hooks/useGetAvailabilities';
import useGetCountries from '@/shared/hooks/useGetCountries';
import useGetCurrencies from '@/shared/hooks/useGetCurrencies';
import useGetEducationLevels from '@/shared/hooks/useGetEducationLevels';
import useGetExperiences from '@/shared/hooks/useGetExperiences';
import useGetJobTitles from '@/shared/hooks/useGetJobTitles';
import useGetLicenses from '@/shared/hooks/useGetLicenses';
import useGetMandatoryCertifications from '@/shared/hooks/useGetMandatoryCertifications';
import useGetRoleCategories from '@/shared/hooks/useGetRoleCategories';
import useGetSeniorityLevels from '@/shared/hooks/useGetSeniorityLevels';
import { type LookupFieldProps, toLookupField } from '../utils/lookup-field';

// Lookup hooks for the select fields; each takes the field's search text.
export type LookupHook = (search: string) => LookupFieldProps;

export const useCountryLookup: LookupHook = (search) => {
  const query = useGetCountries(search);
  return toLookupField(query, query.countries);
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

// Seniority levels of every role category, since the form does not ask for one.
export const useSeniorityLookup: LookupHook = (search) => {
  const { roleCategories } = useGetRoleCategories();
  const query = useGetSeniorityLevels(
    search,
    roleCategories.map((category: { id: number | string }) =>
      Number(category.id),
    ),
  );
  return toLookupField(query, query.seniorityLevels);
};
