'use client';

import { Controller, type FieldPath } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  SelectInputField,
  type Option,
} from '@/shared/components/SelectInputField';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import {
  useFieldBackground,
  useFieldId,
  usePortalContainer,
} from './field-surface';

type CvSelectFieldProps = {
  name: FieldPath<CvBuilderValues>;
  label?: string;
  hint?: string;
  placeholder: string;
  options: Option[];
  'aria-label'?: string;
  disabled?: boolean;
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  withSearchInput?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onSelectionChange?: (option?: Option) => void;
  /** Adds a translated clear option while the field has a value. */
  clearable?: boolean;
};

// Single select bound to the CV builder form.
export default function CvSelectField({
  name,
  clearable = false,
  onSelectionChange,
  ...props
}: CvSelectFieldProps) {
  const t = useTranslations('candidatePage.buildCv.options');
  const background = useFieldBackground();
  const portalContainer = usePortalContainer();
  const id = useFieldId(name);

  return (
    <Controller<CvBuilderValues>
      name={name}
      render={({ field, fieldState }) => {
        return (
          <SelectInputField
            {...props}
            id={id}
            ref={field.ref}
            value={String(field.value ?? '')}
            onChange={(selected) => {
              field.onChange(selected);
              onSelectionChange?.(
                props.options.find((option) => option.value === selected),
              );
            }}
            error={fieldState.error?.message}
            allowDeselect
            clearOptionLabel={clearable ? t('clear-selection') : undefined}
            className={background}
            portalContainer={portalContainer}
          />
        );
      }}
    />
  );
}
