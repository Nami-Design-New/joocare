'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { JOB_SEARCH_STATUS_DOTS } from '../../constants';
import useGetEnumLookup from '../../hooks/useGetEnumLookup';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import LookupError from './LookupError';

const SKELETONS = [0, 1, 2];

// Single choice status shown to employers as a badge on the profile.
export default function JobSearchStatusField() {
  const t = useTranslations('candidatePage.additional-info.career');
  const { control } = useFormContext<AdditionalInfoValues>();
  const statuses = useGetEnumLookup('job-search-statuses');

  return (
    <Controller
      name="jobSearchStatus"
      control={control}
      render={({ field }) => (
        <fieldset className="flex flex-col gap-2">
          <legend className="mx-1 mb-2 flex flex-wrap items-baseline gap-1">
            <span className="font-semibold">{t('job-search-status')}</span>
            <span className="text-sm text-muted-foreground">
              · {t('job-search-status-hint')}
            </span>
          </legend>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {statuses.isPending &&
              SKELETONS.map((index) => (
                <Skeleton key={index} className="h-13 rounded-full" />
              ))}
            {statuses.data?.map(({ value, label }) => {
              const checked = field.value === value;
              return (
                <label
                  key={value}
                  className={cn(
                    'flex h-13 cursor-pointer items-center gap-2.5 rounded-full border px-4 transition-colors',
                    'has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50',
                    checked
                      ? 'border-job-status-open bg-job-status-open/6 font-medium'
                      : 'border-border bg-card hover:border-primary/50',
                  )}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={value}
                    checked={checked}
                    onChange={() => field.onChange(value)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      'size-5 shrink-0 rounded-full bg-card',
                      checked
                        ? 'border-[6px] border-primary'
                        : 'border-[1.5px] border-foreground/30',
                    )}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      'size-2 shrink-0 rounded-full',
                      JOB_SEARCH_STATUS_DOTS[value] ?? 'bg-muted-foreground',
                    )}
                  />
                  {label}
                </label>
              );
            })}
          </div>
          {statuses.isError && <LookupError />}
        </fieldset>
      )}
    />
  );
}
