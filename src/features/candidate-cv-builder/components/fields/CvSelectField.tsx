'use client';

import { Controller, type FieldPath } from 'react-hook-form';
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
};

// Single select bound to the CV builder form.
export default function CvSelectField({ name, ...props }: CvSelectFieldProps) {
  const background = useFieldBackground();
  const portalContainer = usePortalContainer();
  const id = useFieldId(name);

  return (
    <Controller<CvBuilderValues>
      name={name}
      render={({ field, fieldState }) => (
        <SelectInputField
          {...props}
          id={id}
          ref={field.ref}
          value={String(field.value ?? '')}
          onChange={field.onChange}
          error={fieldState.error?.message}
          className={background}
          portalContainer={portalContainer}
        />
      )}
    />
  );
}
