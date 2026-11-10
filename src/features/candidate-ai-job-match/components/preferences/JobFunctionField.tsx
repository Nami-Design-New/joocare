'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { type Control, Controller } from 'react-hook-form';
import { Skeleton } from '@/shared/components/ui/skeleton';
import useGetRoleCategories from '@/shared/hooks/useGetRoleCategories';
import { toLookupOptions } from '@/features/candidate-profile/utils/lookup-options';
import { JOB_FUNCTION_BOTH } from '../../constants';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';
import ChoiceCard from './ChoiceCard';
import PreferenceFieldset from './PreferenceFieldset';

type JobFunctionFieldProps = {
  control: Control<TJobPreferencesSchema>;
};

// Job function = the role categories (Clinical / Non-Clinical), plus "Both".
export default function JobFunctionField({ control }: JobFunctionFieldProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');
  const { roleCategories, isLoading } = useGetRoleCategories();
  const options = useMemo(
    () => [
      ...toLookupOptions(roleCategories),
      { value: JOB_FUNCTION_BOTH, label: t('both') },
    ],
    [roleCategories, t],
  );

  return (
    <PreferenceFieldset legend={t('job-function')}>
      {isLoading ? (
        <Skeleton className="h-12 w-full rounded-xl" />
      ) : (
        <Controller
          name="jobFunction"
          control={control}
          render={({ field }) => (
            <div
              role="radiogroup"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              {options.map((option) => (
                <ChoiceCard
                  key={option.value}
                  type="radio"
                  name={field.name}
                  value={option.value}
                  label={option.label}
                  checked={field.value === option.value}
                  onChange={(checked) =>
                    checked && field.onChange(option.value)
                  }
                />
              ))}
            </div>
          )}
        />
      )}
    </PreferenceFieldset>
  );
}
