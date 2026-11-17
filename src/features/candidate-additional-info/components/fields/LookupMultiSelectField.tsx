'use client';

import { useState } from 'react';
import { type FieldPathByValue, useFormContext } from 'react-hook-form';
import MultiSelectChipsField from '@/shared/components/MultiSelectChipsField';
import type { Option } from '@/shared/components/SelectInputField';
import type { LookupHook } from '../../hooks/useLookupOptions';
import { useSavedOptions } from '../../hooks/useSavedOptions';
import { withSavedOptions } from '../../utils/lookup-field';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import { FIELD_CLASS_NAME } from './FormSelectField';
import LookupError from './LookupError';

type LookupMultiSelectFieldProps = {
  name: FieldPathByValue<AdditionalInfoValues, string[]>;
  label: string;
  placeholder: string;
  useLookup: LookupHook;
  /** Options shown before the API options (e.g. "Other"). */
  leadingOptions?: Option[];
  chipVariant?: 'outline' | 'mobility';
};

// Multi-select with a "N selected" badge and the selection as chips under the field.
export default function LookupMultiSelectField({
  name,
  label,
  placeholder,
  useLookup,
  leadingOptions = [],
  chipVariant = 'outline',
}: LookupMultiSelectFieldProps) {
  const { control } = useFormContext<AdditionalInfoValues>();
  const [search, setSearch] = useState('');
  const lookup = useLookup(search);
  const saved = useSavedOptions(name);

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <MultiSelectChipsField
        control={control}
        name={name}
        label={label}
        placeholder={placeholder}
        {...lookup}
        options={withSavedOptions(
          [...leadingOptions, ...lookup.options],
          search ? [] : saved,
        )}
        onSearchChange={setSearch}
        showSelectedCount={chipVariant === 'outline'}
        chipVariant={chipVariant}
        chipClassName={chipVariant === 'outline' ? 'text-primary' : undefined}
        className={FIELD_CLASS_NAME}
      />
      {lookup.isError && <LookupError />}
    </div>
  );
}
