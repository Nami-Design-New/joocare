'use client';

import {
  Controller,
  type FieldPathByValue,
  useFormContext,
} from 'react-hook-form';
import {
  type Option,
  SelectInputField,
} from '@/shared/components/SelectInputField';
import { useTranslations } from 'next-intl';
import { CLEAR_OPTION } from '../../constants';
import type { AdditionalInfoValues } from '../../types/additional-info.types';

export type StringFieldName = FieldPathByValue<AdditionalInfoValues, string>;

export const FIELD_CLASS_NAME = 'bg-card border-border h-13 shadow-none';

type FormSelectFieldProps = {
  name: StringFieldName;
  label?: string;
  placeholder: string;
  options: Option[];
  disabled?: boolean;
  className?: string;
  containerStyles?: string;
  onSearchChange?: (value: string) => void;
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  /** Runs after the value changes (e.g. to reset a dependent field). */
  onValueChange?: (value: string) => void;
  /** Adds a "Clear selection" option while a value is selected (default on). */
  clearable?: boolean;
};

export default function FormSelectField({
  name,
  label,
  placeholder,
  options,
  className = FIELD_CLASS_NAME,
  onSearchChange,
  onValueChange,
  clearable = true,
  ...props
}: FormSelectFieldProps) {
  const t = useTranslations('candidatePage.additional-info.options');
  const { control } = useFormContext<AdditionalInfoValues>();
  const clearOption: Option = {
    value: CLEAR_OPTION,
    label: t('clear-selection'),
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <SelectInputField
          id={name}
          label={label}
          aria-label={label ? undefined : placeholder}
          placeholder={placeholder}
          options={
            clearable && field.value ? [clearOption, ...options] : options
          }
          value={field.value}
          onChange={(selected) => {
            const value = selected === CLEAR_OPTION ? '' : selected;
            field.onChange(value);
            onValueChange?.(value);
          }}
          ref={field.ref}
          error={fieldState.error?.message}
          allowDeselect
          withSearchInput={Boolean(onSearchChange)}
          onSearchChange={onSearchChange}
          className={className}
          {...props}
        />
      )}
    />
  );
}
