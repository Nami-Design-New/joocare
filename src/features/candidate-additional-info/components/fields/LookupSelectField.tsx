'use client';

import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import type { LookupHook } from '../../hooks/useLookupOptions';
import { useSavedOptions } from '../../hooks/useSavedOptions';
import { withSavedOptions } from '../../utils/lookup-field';
import FormSelectField, { type StringFieldName } from './FormSelectField';
import LookupError from './LookupError';

type LookupSelectFieldProps = {
  name: StringFieldName;
  label?: string;
  placeholder: string;
  useLookup: LookupHook;
  /** Show the search input (off for short fixed lists). */
  searchable?: boolean;
  /** Disables the field on top of the lookup's own loading / error state. */
  disabled?: boolean;
  className?: string;
  containerStyles?: string;
  onValueChange?: (value: string) => void;
  clearable?: boolean;
};

// Select backed by an API lookup (searchable and paginated when the API supports it).
export default function LookupSelectField({
  useLookup,
  searchable = true,
  disabled = false,
  containerStyles,
  ...props
}: LookupSelectFieldProps) {
  const [search, setSearch] = useState('');
  const { isError, ...lookup } = useLookup(search);
  const saved = useSavedOptions(props.name);

  return (
    <div className={cn('flex min-w-0 flex-col gap-1', containerStyles)}>
      <FormSelectField
        {...props}
        {...lookup}
        options={withSavedOptions(lookup.options, search ? [] : saved)}
        disabled={disabled || lookup.disabled}
        onSearchChange={searchable ? setSearch : undefined}
      />
      {isError && <LookupError />}
    </div>
  );
}
