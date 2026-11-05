'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { type Control, useController } from 'react-hook-form';
import { SelectInputField } from '@/shared/components/SelectInputField';
import useGetCitiesByCountryId from '@/shared/hooks/useGetCitiesByCountryId';
import useGetCountries from '@/shared/hooks/useGetCountries';
import { toLookupOptions } from '../../utils/lookup-options';
import type { ExperienceModalFormData } from '../../validation/experience-modal-schema';

type ExperienceLocationFieldsProps = {
  control: Control<ExperienceModalFormData>;
  portalContainer: HTMLElement | null;
};

export default function ExperienceLocationFields({
  control,
  portalContainer,
}: ExperienceLocationFieldsProps) {
  const t = useTranslations();
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const { field: countryField, fieldState: countryState } = useController({
    control,
    name: 'countryId',
  });
  const { field: cityField, fieldState: cityState } = useController({
    control,
    name: 'cityId',
  });
  const {
    countries,
    isLoading: isCountriesLoading,
    hasNextPage: hasMoreCountries,
    isFetchingNextPage: isFetchingMoreCountries,
    fetchNextPage: fetchMoreCountries,
  } = useGetCountries(countrySearch);
  const {
    cities,
    isLoading: isCitiesLoading,
    hasNextPage: hasMoreCities,
    isFetchingNextPage: isFetchingMoreCities,
    fetchNextPage: fetchMoreCities,
  } = useGetCitiesByCountryId(Number(countryField.value), citySearch);
  const countryOptions = useMemo(() => toLookupOptions(countries), [countries]);
  const cityOptions = useMemo(() => toLookupOptions(cities), [cities]);
  const hasCountry = Boolean(countryField.value);
  const isCityLoading = hasCountry && isCitiesLoading;

  const handleCountryChange = (countryId: string) => {
    if (countryId === countryField.value) {
      return;
    }

    countryField.onChange(countryId);
    cityField.onChange('');
    setCitySearch('');
  };

  return (
    <div className="flex gap-2 max-md:flex-col">
      <SelectInputField
        id="countryId"
        label={t('candidatePage.profile.country')}
        placeholder={
          isCountriesLoading
            ? t('candidatePage.profile.loading-countries')
            : t('common.select')
        }
        options={countryOptions}
        value={countryField.value}
        onChange={handleCountryChange}
        disabled={isCountriesLoading}
        withSearchInput
        searchPlaceholder={t('candidatePage.profile.search-countries')}
        onSearchChange={setCountrySearch}
        portalContainer={portalContainer}
        onReachEnd={() => void fetchMoreCountries()}
        hasNextPage={hasMoreCountries}
        isFetchingNextPage={isFetchingMoreCountries}
        error={countryState.error?.message}
      />

      <SelectInputField
        id="cityId"
        label={t('candidatePage.profile.city')}
        placeholder={
          isCityLoading
            ? t('candidatePage.profile.loading-cities')
            : t('common.select')
        }
        options={cityOptions}
        value={cityField.value}
        onChange={cityField.onChange}
        disabled={!hasCountry || isCityLoading}
        withSearchInput
        searchPlaceholder={t(
          'candidateSettingsPage.placeholders.search-cities',
        )}
        onSearchChange={setCitySearch}
        portalContainer={portalContainer}
        onReachEnd={() => void fetchMoreCities()}
        hasNextPage={hasMoreCities}
        isFetchingNextPage={isFetchingMoreCities}
        error={cityState.error?.message}
      />
    </div>
  );
}
