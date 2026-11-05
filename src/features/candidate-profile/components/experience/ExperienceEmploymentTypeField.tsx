'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { type Control, Controller } from 'react-hook-form';
import { SelectInputField } from '@/shared/components/SelectInputField';
import useGetEmploymentTypes from '@/shared/hooks/useGetEmploymentTypes';
import { toLookupOptions } from '../../utils/lookup-options';
import type { ExperienceModalFormData } from '../../validation/experience-modal-schema';

type ExperienceEmploymentTypeFieldProps = {
  control: Control<ExperienceModalFormData>;
  portalContainer: HTMLElement | null;
};

export default function ExperienceEmploymentTypeField({
  control,
  portalContainer,
}: ExperienceEmploymentTypeFieldProps) {
  const t = useTranslations('candidatePage.profile');
  const [search, setSearch] = useState('');
  const {
    employmentTypes,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetEmploymentTypes(search);
  const options = useMemo(
    () => toLookupOptions(employmentTypes),
    [employmentTypes],
  );

  return (
    <Controller
      name="employmentTypeId"
      control={control}
      render={({ field, fieldState }) => (
        <SelectInputField
          id="employmentTypeId"
          label={t('employment-type')}
          placeholder={
            isLoading
              ? t('loading-employment-types')
              : t('employment-type-placeholder')
          }
          options={options}
          value={field.value}
          onChange={field.onChange}
          disabled={isLoading}
          withSearchInput
          searchPlaceholder={t('search-employment-types')}
          onSearchChange={setSearch}
          portalContainer={portalContainer}
          onReachEnd={() => void fetchNextPage()}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          error={
            fieldState.error?.message ??
            (error instanceof Error ? error.message : undefined)
          }
        />
      )}
    />
  );
}
