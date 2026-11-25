'use client';

import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import useGetEnumLookup from '@/features/candidate-additional-info/hooks/useGetEnumLookup';
import {
  type LookupHook,
  useAvailabilityLookup,
  useCertificationLookup,
  useCountryLookup,
  useCurrencyLookup,
  useDomainLookup,
  useEducationLevelLookup,
  useExperienceLookup,
  useGenderLookup,
  useJobTitleLookup,
  useLanguageLookup,
  useLicenseStatusLookup,
  useMaritalStatusLookup,
  useProficiencyLookup,
  useSponsorshipLookup,
  useVerificationStatusLookup,
  useVisaStatusLookup,
} from '@/features/candidate-additional-info/hooks/useLookupOptions';
import {
  toEnumLookupField,
  toLookupField,
} from '@/features/candidate-additional-info/utils/lookup-field';
import useGetCategories from '@/shared/hooks/useGetCategories';
import useGetCitiesByCountryId from '@/shared/hooks/useGetCitiesByCountryId';
import useGetEmploymentTypes from '@/shared/hooks/useGetEmploymentTypes';
import { useInfiniteLookup } from '@/shared/hooks/useInfiniteLookup';
import { PROFESSIONAL_LICENSE_VALUES } from '../constants/talent-filters';
import type {
  TalentFilterValues,
  TalentLookupKey,
} from '../types/talent-database.types';

const useCategoryLookup: LookupHook = (search) => {
  const query = useGetCategories(search);
  return toLookupField(query, query.categories);
};

const useEmploymentTypeLookup: LookupHook = (search) => {
  const query = useGetEmploymentTypes(search);
  return toLookupField(query, query.employmentTypes);
};

// The company searches every level, not only one role category's.
const useSeniorityLookup: LookupHook = (search) => {
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

// Cities of the country picked in the same form; empty until one is picked.
const useCityLookup: LookupHook = (search) => {
  const { control } = useFormContext<TalentFilterValues>();
  const country = useWatch({ control, name: 'country' });
  const countryId = typeof country === 'string' ? Number(country) : 0;
  const query = useGetCitiesByCountryId(countryId, search);
  const lookup = toLookupField(query, query.cities);
  return { ...lookup, disabled: !countryId || lookup.disabled };
};

const useJobSearchStatusLookup: LookupHook = () =>
  toEnumLookupField(useGetEnumLookup('job-search-statuses'));

const useLastActiveLookup: LookupHook = () =>
  toEnumLookupField(useGetEnumLookup('last-active-options'));

// Two fixed choices; the API takes the value, the label is translated here.
const useProfessionalLicenseLookup: LookupHook = () => {
  const t = useTranslations('companyPage.talent-database.options');
  const options = useMemo(
    () =>
      PROFESSIONAL_LICENSE_VALUES.map((value) => ({
        value,
        label: t(value.replaceAll('_', '-')),
      })),
    [t],
  );
  return toEnumLookupField({ data: options, isLoading: false, isError: false });
};

export const TALENT_LOOKUPS: Record<TalentLookupKey, LookupHook> = {
  categories: useCategoryLookup,
  certifications: useCertificationLookup,
  cities: useCityLookup,
  countries: useCountryLookup,
  currencies: useCurrencyLookup,
  domains: useDomainLookup,
  'education-levels': useEducationLevelLookup,
  'employment-types': useEmploymentTypeLookup,
  experiences: useExperienceLookup,
  genders: useGenderLookup,
  'job-search-statuses': useJobSearchStatusLookup,
  'job-titles': useJobTitleLookup,
  languages: useLanguageLookup,
  'last-active': useLastActiveLookup,
  'license-statuses': useLicenseStatusLookup,
  'marital-statuses': useMaritalStatusLookup,
  'notice-periods': useAvailabilityLookup,
  'professional-licenses': useProfessionalLicenseLookup,
  'proficiency-levels': useProficiencyLookup,
  'seniority-levels': useSeniorityLookup,
  'sponsorship-requirements': useSponsorshipLookup,
  'verification-statuses': useVerificationStatusLookup,
  'visa-statuses': useVisaStatusLookup,
};
