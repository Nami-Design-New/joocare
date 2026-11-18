'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Control } from 'react-hook-form';
import useGetJobTitles from '@/shared/hooks/useGetJobTitles';
import { toLookupOptions } from '@/features/candidate-profile/utils/lookup-options';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';
import MultiSelectChipsField from '@/shared/components/MultiSelectChipsField';
import type { Option } from '@/shared/components/SelectInputField';

type JobTitlesFieldProps = {
  control: Control<TJobPreferencesSchema>;
  portalContainer: HTMLElement | null;
  savedOptions: Option[];
};

export default function JobTitlesField({
  control,
  portalContainer,
  savedOptions,
}: JobTitlesFieldProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');
  const [search, setSearch] = useState('');
  const {
    jobTitles,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetJobTitles(search);
  const options = useMemo(() => {
    const lookupOptions = toLookupOptions(jobTitles);
    const savedValues = new Set(savedOptions.map((option) => option.value));
    return [
      ...savedOptions,
      ...lookupOptions.filter((option) => !savedValues.has(option.value)),
    ];
  }, [jobTitles, savedOptions]);

  return (
    <MultiSelectChipsField
      control={control}
      name="jobTitleIds"
      label={t('job-title')}
      placeholder={isLoading ? t('loading') : t('job-title-placeholder')}
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
