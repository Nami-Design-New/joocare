'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { type Control, useController } from 'react-hook-form';
import { InputField } from '@/shared/components/InputField';
import { SelectInputField } from '@/shared/components/SelectInputField';
import useGetJobTitles from '@/shared/hooks/useGetJobTitles';
import { OTHER_JOB_TITLE_VALUE } from '../../constants/experience';
import { findJobTitleId } from '../../utils/experience-form';
import { toLookupOptions } from '../../utils/lookup-options';
import type { ExperienceModalFormData } from '../../validation/experience-modal-schema';

type ExperienceJobTitleFieldProps = {
  control: Control<ExperienceModalFormData>;
  portalContainer: HTMLElement | null;
  initialTitle?: string;
};

export default function ExperienceJobTitleField({
  control,
  portalContainer,
  initialTitle,
}: ExperienceJobTitleFieldProps) {
  const t = useTranslations();
  const [search, setSearch] = useState('');
  const { field: jobTitleField, fieldState: jobTitleState } = useController({
    control,
    name: 'jobTitle',
  });
  const { field: otherJobTitleField, fieldState: otherJobTitleState } =
    useController({ control, name: 'otherJobTitle' });
  const {
    jobTitles,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetJobTitles(search);
  const options = useMemo(
    () => [
      { label: t('authPage.common.other'), value: OTHER_JOB_TITLE_VALUE },
      ...toLookupOptions(jobTitles),
    ],
    [jobTitles, t],
  );
  const isOtherJobTitle = jobTitleField.value === OTHER_JOB_TITLE_VALUE;
  const matchedJobTitleId = initialTitle
    ? findJobTitleId(initialTitle, jobTitles)
    : null;
  const isInitialTitleUntouched =
    isOtherJobTitle && otherJobTitleField.value === initialTitle;

  useEffect(() => {
    if (!matchedJobTitleId || !isInitialTitleUntouched) {
      return;
    }

    jobTitleField.onChange(matchedJobTitleId);
    otherJobTitleField.onChange('');
  }, [
    isInitialTitleUntouched,
    jobTitleField,
    matchedJobTitleId,
    otherJobTitleField,
  ]);

  const handleJobTitleChange = (value: string) => {
    jobTitleField.onChange(value);

    if (value !== OTHER_JOB_TITLE_VALUE) {
      otherJobTitleField.onChange('');
    }
  };

  return (
    <>
      <SelectInputField
        id="jobTitle"
        label={t('authPage.common.job-title')}
        placeholder={
          isLoading
            ? t('candidatePage.profile.loading-job-titles')
            : t('candidatePage.profile.select-job-title')
        }
        options={options}
        value={jobTitleField.value}
        onChange={handleJobTitleChange}
        disabled={isLoading}
        withSearchInput
        searchPlaceholder={t('candidatePage.profile.search-job-titles')}
        onSearchChange={setSearch}
        portalContainer={portalContainer}
        onReachEnd={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        error={
          jobTitleState.error?.message ??
          (error instanceof Error ? error.message : undefined)
        }
      />

      {isOtherJobTitle && (
        <InputField
          id="otherJobTitle"
          label={t('authPage.common.other-job-title')}
          placeholder={t('candidatePage.profile.enter-job-title')}
          {...otherJobTitleField}
          value={otherJobTitleField.value ?? ''}
          error={otherJobTitleState.error?.message}
        />
      )}
    </>
  );
}
