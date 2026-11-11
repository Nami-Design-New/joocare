'use client';

import { useState, type ComponentProps } from 'react';
import {
  type Control,
  Controller,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { MultiSelectInputField } from './MultiSelectInputField';
import RemovableChips from './RemovableChips';
import type { Option } from './SelectInputField';

type MultiSelectChipsFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPathByValue<T, string[]>;
  label: string;
  placeholder: string;
  options: Option[];
  portalContainer?: HTMLElement | null;
  disabled?: boolean;
  /** Show a "N selected" badge inside the field. */
  showSelectedCount?: boolean;
  className?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  chipVariant?: ComponentProps<typeof RemovableChips>['variant'];
  chipClassName?: string;
  withInitial?: boolean;
  hint?: string;
};

// Multi-select whose selection is shown as removable chips under the field.
export default function MultiSelectChipsField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  portalContainer,
  disabled,
  showSelectedCount = false,
  className,
  searchPlaceholder,
  onSearchChange,
  onReachEnd,
  hasNextPage,
  isFetchingNextPage,
  chipVariant,
  chipClassName,
  withInitial,
  hint,
}: MultiSelectChipsFieldProps<T>) {
  const t = useTranslations('common');
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
      render={({ field }) => {
        const values: string[] = field.value ?? [];
        return (
          <div className="flex min-w-0 flex-col gap-3">
            <MultiSelectInputField
              id={name}
              label={label}
              placeholder={placeholder}
              options={options}
              value={values}
              onChange={field.onChange}
              disabled={disabled}
              hideSelectedChips
              selectedCountLabel={
                showSelectedCount
                  ? t('selected-count', { count: values.length })
                  : undefined
              }
              withSearchInput
              searchPlaceholder={searchPlaceholder ?? placeholder}
              onSearchChange={onSearchChange}
              onReachEnd={onReachEnd}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              portalContainer={portalContainer}
              className={className}
            />
            <RemovableChips
              variant={chipVariant}
              chipClassName={chipClassName}
              withInitial={withInitial}
              items={values.map((value) => ({
                value,
                label: labels.get(value) ?? value,
              }))}
              onRemove={(value) =>
                field.onChange(values.filter((item) => item !== value))
              }
            />
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        );
      }}
    />
  );
}
