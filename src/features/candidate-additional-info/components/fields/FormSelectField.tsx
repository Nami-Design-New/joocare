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
};

export default function FormSelectField({
  name,
  label,
  placeholder,
  options,
  className = FIELD_CLASS_NAME,
  onSearchChange,
  onValueChange,
  ...props
}: FormSelectFieldProps) {
  const { control } = useFormContext<AdditionalInfoValues>();

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
          options={options}
          value={field.value}
          onChange={(value) => {
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
