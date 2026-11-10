'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { type Control, Controller } from 'react-hook-form';
import { Skeleton } from '@/shared/components/ui/skeleton';
import useGetDomains from '@/shared/hooks/useGetDomains';
import { toLookupOptions } from '@/features/candidate-profile/utils/lookup-options';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';
import ChoiceCard from './ChoiceCard';
import PreferenceFieldset from './PreferenceFieldset';

type PreferredDomainsFieldProps = {
  control: Control<TJobPreferencesSchema>;
};

export default function PreferredDomainsField({
  control,
}: PreferredDomainsFieldProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');
  const { domains, isLoading } = useGetDomains();
  const options = useMemo(() => toLookupOptions(domains), [domains]);

  return (
    <PreferenceFieldset legend={t('preferred-domain')}>
      {isLoading ? (
        <Skeleton className="h-12 w-full rounded-xl" />
      ) : (
        <Controller
          name="domainIds"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {options.map((option) => (
                <ChoiceCard
                  key={option.value}
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  label={option.label}
                  checked={field.value.includes(option.value)}
                  onChange={(checked) =>
                    field.onChange(
                      checked
                        ? [...field.value, option.value]
                        : field.value.filter((id) => id !== option.value),
                    )
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
