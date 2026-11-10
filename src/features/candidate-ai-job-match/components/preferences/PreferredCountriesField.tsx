'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Control } from 'react-hook-form';
import useGetCountries from '@/shared/hooks/useGetCountries';
import { toLookupOptions } from '@/features/candidate-profile/utils/lookup-options';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';
import MultiSelectChipsField from '@/shared/components/MultiSelectChipsField';

type PreferredCountriesFieldProps = {
  control: Control<TJobPreferencesSchema>;
  portalContainer: HTMLElement | null;
};

export default function PreferredCountriesField({
  control,
  portalContainer,
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
  const options = useMemo(() => toLookupOptions(countries), [countries]);

  return (
    <MultiSelectChipsField
      control={control}
      name="countryIds"
      label={t('location')}
      placeholder={isLoading ? t('loading') : t('country-placeholder')}
      options={options}
      disabled={isLoading}
      portalContainer={portalContainer}
      searchPlaceholder={t('search')}
      onSearchChange={setSearch}
      onReachEnd={() => void fetchNextPage()}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
