'use client';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import MultiSelectChipsField from '@/shared/components/MultiSelectChipsField';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { TALENT_LOOKUPS } from '../hooks/useTalentLookups';
import type {
  TalentFilterField,
  TalentFilterValues,
  TalentLookupKey,
} from '../types/talent-database.types';

type TalentLookupFieldProps = {
  field: TalentFilterField & { lookup: TalentLookupKey };
  className: string;
};

// Multi fields hold string arrays; this view lets the chips field type its name.
type TalentMultiValues = Record<string, string[]>;

// One select (or multi-select) whose options come from the field's lookup.
export default function TalentLookupField({
  field,
  className,
}: TalentLookupFieldProps) {
  const t = useTranslations('companyPage.talent-database');
  const { control, setValue } = useFormContext<TalentFilterValues>();
  const { control: multiControl } = useFormContext<TalentMultiValues>();
  const [search, setSearch] = useState('');
  const { isError, disabled, ...lookup } = TALENT_LOOKUPS[field.lookup](search);
  const label = t(`fields.${field.key}`);
  const placeholder = t(field.placeholder ?? 'choose');
  const error = isError ? t('options-error') : undefined;

  if (field.kind === 'multi') {
    return (
      <div className="flex min-w-0 flex-col gap-1">
        <MultiSelectChipsField
          control={multiControl}
          name={field.key}
          label={label}
          placeholder={placeholder}
          {...lookup}
          disabled={disabled}
          searchPlaceholder={t('search-options')}
          onSearchChange={setSearch}
          showSelectedCount
          chipVariant="outline"
          chipClassName="text-primary"
          className={className}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <Controller
      control={control}
      name={field.key}
      defaultValue=""
      render={({ field: formField }) => (
        <SelectInputField
          id={`talent-${field.key}`}
          label={label}
          placeholder={placeholder}
          {...lookup}
          disabled={disabled}
          error={error}
          withSearchInput
          searchPlaceholder={t('search-options')}
          onSearchChange={setSearch}
          className={className}
          value={typeof formField.value === 'string' ? formField.value : ''}
          onChange={(value) => {
            formField.onChange(value);
            field.resets?.forEach((name) => setValue(name, ''));
          }}
          ref={formField.ref}
          allowDeselect
        />
      )}
    />
  );
}
