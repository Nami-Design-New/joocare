'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Control } from 'react-hook-form';
import useGetRoleCategories from '@/shared/hooks/useGetRoleCategories';
import useGetSeniorityLevels from '@/shared/hooks/useGetSeniorityLevels';
import { toLookupOptions } from '@/features/candidate-profile/utils/lookup-options';
import { JOB_FUNCTION_BOTH } from '../../constants';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';
import PreferenceMultiSelectField from './PreferenceMultiSelectField';

type SeniorityLevelsFieldProps = {
  control: Control<TJobPreferencesSchema>;
  jobFunction: string;
  portalContainer: HTMLElement | null;
};

// Seniority levels belong to role categories, so they load once a job function is chosen.
export default function SeniorityLevelsField({
  control,
  jobFunction,
  portalContainer,
}: SeniorityLevelsFieldProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');
  const [search, setSearch] = useState('');
  const { roleCategories } = useGetRoleCategories();
  const roleCategoryIds = useMemo(
    () =>
      jobFunction === JOB_FUNCTION_BOTH
        ? roleCategories.map((category: { id: number }) => category.id)
        : [Number(jobFunction)].filter(Boolean),
    [jobFunction, roleCategories],
  );
  const {
    seniorityLevels,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetSeniorityLevels(search, roleCategoryIds);
  const options = useMemo(
    () => toLookupOptions(seniorityLevels),
    [seniorityLevels],
  );
  const needsJobFunction = roleCategoryIds.length === 0;

  return (
    <PreferenceMultiSelectField
      control={control}
      name="seniorityLevelIds"
      label={t('seniority-level')}
      placeholder={
        needsJobFunction
          ? t('choose-job-function-first')
          : isLoading
            ? t('loading')
            : t('seniority-placeholder')
      }
      options={options}
      disabled={needsJobFunction || isLoading}
      portalContainer={portalContainer}
      searchPlaceholder={t('search')}
      onSearchChange={setSearch}
      onReachEnd={() => void fetchNextPage()}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
