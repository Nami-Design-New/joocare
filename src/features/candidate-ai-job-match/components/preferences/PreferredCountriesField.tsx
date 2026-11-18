'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { type Control, Controller } from 'react-hook-form';
import useGetCountries from '@/shared/hooks/useGetCountries';
import { toLookupOptions } from '@/features/candidate-profile/utils/lookup-options';
import { SelectInputField } from '@/shared/components/SelectInputField';
import type { Option } from '@/shared/components/SelectInputField';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';

type PreferredCountriesFieldProps = {
  control: Control<TJobPreferencesSchema>;
  portalContainer: HTMLElement | null;
  savedOption: Option | null;
};

export default function PreferredCountriesField({
  control,
  portalContainer,
  savedOption,
}: PreferredCountriesFieldProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');
  const [search, setSearch] = useState('');
  const {
    countries,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetCountries(search);
  const options = useMemo(() => {
    const lookupOptions = toLookupOptions(countries);
    if (!savedOption || lookupOptions.some((option) => option.value === savedOption.value)) {
      return lookupOptions;
    }
    return [savedOption, ...lookupOptions];
  }, [countries, savedOption]);

  return (
    <Controller
      control={control}
      name="countryId"
      render={({ field }) => (
        <SelectInputField
          id="preferred-country"
          label={t('location')}
          placeholder={isLoading ? t('loading') : t('country-placeholder')}
          options={options}
          value={field.value}
          onChange={field.onChange}
          disabled={isLoading}
          portalContainer={portalContainer}
          withSearchInput
          searchPlaceholder={t('search')}
          onSearchChange={setSearch}
          onReachEnd={() => void fetchNextPage()}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          allowDeselect
        />
      )}
    />
  );
}
