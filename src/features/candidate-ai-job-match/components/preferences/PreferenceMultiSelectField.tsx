'use client';

import { useState } from 'react';
import {
  type Control,
  Controller,
  type FieldPathByValue,
} from 'react-hook-form';
import { MultiSelectInputField } from '@/shared/components/MultiSelectInputField';
import type { Option } from '@/shared/components/SelectInputField';
import type { TJobPreferencesSchema } from '../../validation/job-preferences-schema';
import PreferenceChips from './PreferenceChips';

type PreferenceMultiSelectFieldProps = {
  control: Control<TJobPreferencesSchema>;
  name: FieldPathByValue<TJobPreferencesSchema, string[]>;
  label: string;
  placeholder: string;
  options: Option[];
  portalContainer: HTMLElement | null;
  disabled?: boolean;
  withInitial?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

// Multi-select whose selection is shown as removable chips under the field (as in the design).
export default function PreferenceMultiSelectField({
  control,
  name,
  label,
  placeholder,
  options,
  portalContainer,
  disabled,
  withInitial,
  searchPlaceholder,
  onSearchChange,
  onReachEnd,
  hasNextPage,
  isFetchingNextPage,
}: PreferenceMultiSelectFieldProps) {
  // Keep labels of selected values, even when a search hides them from `options`.
  const [labels, setLabels] = useState(() => new Map<string, string>());
  if (options.some((option) => labels.get(option.value) !== option.label)) {
    setLabels((current) => {
      const next = new Map(current);
      options.forEach((option) => next.set(option.value, option.label));
      return next;
    });
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-3">
          <MultiSelectInputField
            id={name}
            label={label}
            placeholder={placeholder}
            options={options}
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            hideSelectedChips
            withSearchInput={Boolean(onSearchChange)}
            searchPlaceholder={searchPlaceholder}
            onSearchChange={onSearchChange}
            onReachEnd={onReachEnd}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            portalContainer={portalContainer}
          />
          <PreferenceChips
            withInitial={withInitial}
            items={field.value.map((value) => ({
              value,
              label: labels.get(value) ?? value,
            }))}
            onRemove={(value) =>
              field.onChange(field.value.filter((item) => item !== value))
            }
          />
        </div>
      )}
    />
  );
}
