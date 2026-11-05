'use client';

import { useState } from 'react';
import { type FieldPathByValue, useFormContext } from 'react-hook-form';
import MultiSelectChipsField from '@/shared/components/MultiSelectChipsField';
import type { Option } from '@/shared/components/SelectInputField';
import type { LookupHook } from '../../hooks/useLookupOptions';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import { FIELD_CLASS_NAME } from './FormSelectField';

type LookupMultiSelectFieldProps = {
  name: FieldPathByValue<AdditionalInfoValues, string[]>;
  label: string;
  placeholder: string;
  /** API lookup; omit it and pass `options` for a fixed list. */
  useLookup?: LookupHook;
  options?: Option[];
  chipVariant?: 'outline' | 'mobility';
};

const useNoLookup: LookupHook = () => ({
  options: [],
  disabled: false,
  onReachEnd: () => undefined,
  hasNextPage: false,
  isFetchingNextPage: false,
});

// Multi-select with a "N selected" badge and the selection as chips under the field.
export default function LookupMultiSelectField({
  name,
  label,
  placeholder,
  useLookup = useNoLookup,
  options,
  chipVariant = 'outline',
}: LookupMultiSelectFieldProps) {
  const { control } = useFormContext<AdditionalInfoValues>();
  const [search, setSearch] = useState('');
  const lookup = useLookup(search);

  return (
    <MultiSelectChipsField
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      {...lookup}
      options={options ?? lookup.options}
      onSearchChange={options ? undefined : setSearch}
      showSelectedCount={chipVariant === 'outline'}
      chipVariant={chipVariant}
      chipClassName={chipVariant === 'outline' ? 'text-primary' : undefined}
      className={FIELD_CLASS_NAME}
    />
  );
}
