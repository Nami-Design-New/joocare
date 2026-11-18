'use client';

import { useMemo, useState } from 'react';
import type { Control } from 'react-hook-form';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';
import MultiSelectChipsField from '@/shared/components/MultiSelectChipsField';
import type { Option } from '@/shared/components/SelectInputField';
import { useTranslations } from 'next-intl';
import { toLookupOptions } from '@/features/candidate-profile/utils/lookup-options';
import useGetCompanies from '../../hooks/useGetCompanies';

type PreferredCompaniesFieldProps = {
  control: Control<TJobPreferencesSchema>;
  portalContainer: HTMLElement | null;
  savedOptions: Option[];
};

export default function PreferredCompaniesField({
  control,
  portalContainer,
  savedOptions,
}: PreferredCompaniesFieldProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');
  const [search, setSearch] = useState('');
  const {
    companies,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetCompanies(search);
  const options = useMemo(() => {
    const companyOptions = toLookupOptions(companies);
    const savedValues = new Set(savedOptions.map((option) => option.value));

    return [
      ...savedOptions,
      ...companyOptions.filter((option) => !savedValues.has(option.value)),
    ];
  }, [companies, savedOptions]);

  return (
    <MultiSelectChipsField
      control={control}
      name="companyIds"
      label={t('preferred-companies')}
      placeholder={isLoading ? t('loading') : t('companies-placeholder')}
      options={options}
      portalContainer={portalContainer}
      disabled={isLoading}
      withInitial
      searchPlaceholder={t('search')}
      onSearchChange={setSearch}
      onReachEnd={() => void fetchNextPage()}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
