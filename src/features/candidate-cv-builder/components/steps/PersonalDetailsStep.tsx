'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import type { Option } from '@/shared/components/SelectInputField';
import useGetCitiesByCountryId from '@/shared/hooks/useGetCitiesByCountryId';
import useGetCountries from '@/shared/hooks/useGetCountries';
import {
  useLanguageLookup,
  useMaritalStatusLookup,
  useProficiencyLookup,
} from '@/features/candidate-additional-info/hooks/useLookupOptions';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import { emptyLanguage } from '../../utils/cv-builder-defaults';
import CvPhotoField from '../fields/CvPhotoField';
import CvSelectField from '../fields/CvSelectField';
import CvTextField from '../fields/CvTextField';
import CvAddButton from '../wizard/CvAddButton';
import CvStepCard from '../wizard/CvStepCard';

// Step 1: photo, name, nationality, birth year, marital status, location and languages.
function withSelectedOption(options: Option[], value: string, label?: string) {
  return value && label && !options.some((option) => option.value === value)
    ? [{ value, label }, ...options]
    : options;
}

export default function PersonalDetailsStep() {
  const t = useTranslations('candidatePage.buildCv');
  const { control, setValue } = useFormContext<CvBuilderValues>();
  const countryId = useWatch({ control, name: 'personal.country' });
  const personal = useWatch({ control, name: 'personal' });
  const previousCountryId = useRef(countryId);
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const nationalities = useGetCountries(nationalitySearch);
  const countries = useGetCountries(countrySearch);
  const cities = useGetCitiesByCountryId(Number(countryId), citySearch);
  const maritalStatuses = useMaritalStatusLookup('');
  const languageOptions = useLanguageLookup('');
  const proficiencyOptions = useProficiencyLookup('');
  const languages = useFieldArray<CvBuilderValues, 'personal.languages'>({
    name: 'personal.languages',
  });
  const nationalityOptions = useMemo(
    () =>
      nationalities.countries
        .map((country) => ({
          label: String(country.title ?? country.name ?? ''),
          value: String(country.id ?? ''),
        }))
        .filter((country) => country.label && country.value),
    [nationalities.countries],
  );
  const countryOptions = useMemo(
    () =>
      countries.countries
        .map((country) => ({
          label: String(country.title ?? country.name ?? ''),
          value: String(country.id ?? ''),
        }))
        .filter((country) => country.label && country.value),
    [countries.countries],
  );
  const cityOptions = useMemo(
    () =>
      cities.cities
        .map((city) => ({
          label: String(city.title ?? city.name ?? ''),
          value: String(city.id ?? ''),
        }))
        .filter((city) => city.label && city.value),
    [cities.cities],
  );

  useEffect(() => {
    if (previousCountryId.current === countryId) return;

    previousCountryId.current = countryId;
    setValue('personal.city', '');
  }, [countryId, setValue]);

  return (
    <div className="flex flex-col gap-8 sm:gap-15">
      <CvStepCard
        title={t('personal.title')}
        description={t('personal.description')}
      >
        <CvPhotoField />
        <CvTextField
          name="personal.fullName"
          label={t('personal.full-name')}
          placeholder={t('personal.full-name-placeholder')}
          autoComplete="name"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <CvSelectField
            name="personal.nationality"
            label={t('personal.nationality')}
            placeholder={t('common.choose')}
            options={withSelectedOption(
              nationalityOptions,
              personal.nationality,
              personal.nationalityLabel,
            )}
            disabled={nationalities.isLoading}
            withSearchInput
            onSearchChange={setNationalitySearch}
            onReachEnd={() => void nationalities.fetchNextPage()}
            hasNextPage={nationalities.hasNextPage}
            isFetchingNextPage={nationalities.isFetchingNextPage}
          />
          <CvTextField
            name="personal.yearOfBirth"
            type="date"
            label={t('personal.year-of-birth')}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <CvSelectField
            name="personal.maritalStatus"
            label={t('personal.marital-status')}
            hint={t('common.optional')}
            placeholder={t('common.choose')}
            options={maritalStatuses.options}
            disabled={maritalStatuses.disabled}
            withSearchInput
            clearable
          />
          <CvSelectField
            name="personal.country"
            label={t('personal.country')}
            placeholder={t('common.choose')}
            options={withSelectedOption(
              countryOptions,
              personal.country,
              personal.countryLabel,
            )}
            disabled={countries.isLoading}
            withSearchInput
            onSearchChange={setCountrySearch}
            onReachEnd={() => void countries.fetchNextPage()}
            hasNextPage={countries.hasNextPage}
            isFetchingNextPage={countries.isFetchingNextPage}
          />
          <CvSelectField
            name="personal.city"
            label={t('personal.city')}
            placeholder={t('common.choose')}
            options={withSelectedOption(
              cityOptions,
              personal.city,
              personal.cityLabel,
            )}
            disabled={!countryId || cities.isLoading}
            withSearchInput
            onSearchChange={setCitySearch}
            onReachEnd={() => void cities.fetchNextPage()}
            hasNextPage={cities.hasNextPage}
            isFetchingNextPage={cities.isFetchingNextPage}
          />
        </div>
      </CvStepCard>

      <CvStepCard
        title={t('languages.title')}
        description={t('languages.description')}
      >
        {languages.fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-3">
            <div className="grid grow gap-4 sm:grid-cols-2">
              <CvSelectField
                name={`personal.languages.${index}.language`}
                label={t('languages.language')}
                placeholder={t('common.choose')}
                options={languageOptions.options}
                disabled={languageOptions.disabled}
                withSearchInput
                clearable
              />
              <CvSelectField
                name={`personal.languages.${index}.proficiency`}
                label={t('languages.proficiency')}
                placeholder={t('common.choose')}
                options={proficiencyOptions.options}
                disabled={proficiencyOptions.disabled}
                withSearchInput
                clearable
              />
            </div>
            {languages.fields.length > 1 && (
              <button
                type="button"
                onClick={() => languages.remove(index)}
                aria-label={t('languages.remove')}
                className="flex size-13 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-destructive"
              >
                <X aria-hidden className="size-5" />
              </button>
            )}
          </div>
        ))}
        <CvAddButton
          variant="dashed"
          label={t('languages.add')}
          onClick={() => languages.append(emptyLanguage())}
        />
      </CvStepCard>
    </div>
  );
}
