'use client';

import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { MultiSelectInputField } from '@/shared/components/MultiSelectInputField';
import type {
  TalentFilterField,
  TalentFilterValues,
} from '../types/talent-database.types';
import { cn } from '@/shared/lib/utils';

type TalentFilterFieldsProps = {
  fields: TalentFilterField[];
  className?: string;
};

export default function TalentFilterFields({
  fields,
  className,
}: TalentFilterFieldsProps) {
  const t = useTranslations('companyPage.talent-database');
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TalentFilterValues>();
  // Stable option arrays per field: the Combobox re-syncs its store whenever
  // `items` changes identity, so rebuilding them on every render loops.
  const optionsByField = useMemo(
    () =>
      new Map(
        fields.map((field) => [
          field.key,
          (field.options ?? []).map((value) => ({
            value,
            label: t(`options.${value}`),
          })),
        ]),
      ),
    [fields, t],
  );
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3', className)}>
      {fields.map((field) => {
        const id = `talent-${field.key}`;
        const label = t(`fields.${field.key}`);
        const error =
          typeof errors[field.key]?.message === 'string'
            ? errors[field.key]?.message
            : undefined;
        const placeholder = t(field.placeholder ?? 'choose');
        const inputClass =
          'bg-card h-13 rounded-full border-border shadow-none';
        if (field.kind === 'text' || field.kind === 'number') {
          return (
            <InputField
              key={field.key}
              id={id}
              label={label}
              placeholder={placeholder}
              type={field.kind === 'number' ? 'number' : 'text'}
              min={field.kind === 'number' ? 0 : undefined}
              error={error}
              className={inputClass}
              {...register(field.key)}
            />
          );
        }
        const options = optionsByField.get(field.key) ?? [];
        return (
          <Controller
            key={field.key}
            control={control}
            name={field.key}
            defaultValue={field.kind === 'multi' ? [] : ''}
            render={({ field: formField }) =>
              field.kind === 'multi' ? (
                <MultiSelectInputField
                  id={id}
                  label={label}
                  options={options}
                  placeholder={placeholder}
                  value={Array.isArray(formField.value) ? formField.value : []}
                  onChange={formField.onChange}
                  ref={formField.ref}
                  withSearchInput
                  searchPlaceholder={t('search-options')}
                  className={inputClass}
                />
              ) : (
                <SelectInputField
                  id={id}
                  label={label}
                  options={options}
                  placeholder={placeholder}
                  value={
                    typeof formField.value === 'string' ? formField.value : ''
                  }
                  onChange={formField.onChange}
                  ref={formField.ref}
                  allowDeselect
                  withSearchInput
                  searchPlaceholder={t('search-options')}
                  className={inputClass}
                />
              )
            }
          />
        );
      })}
    </div>
  );
}
