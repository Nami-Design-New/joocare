'use client';

import type { ComponentProps } from 'react';
import { Controller, type FieldPath } from 'react-hook-form';
import { TextareaField } from '@/shared/components/TextareaField';
import { cn } from '@/shared/lib/utils';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import { useFieldBackground, useFieldId } from './field-surface';

type CvTextareaFieldProps = Omit<
  ComponentProps<typeof TextareaField>,
  'id' | 'name' | 'value' | 'onChange' | 'onBlur' | 'error'
> & {
  name: FieldPath<CvBuilderValues>;
};

// Textarea bound to the CV builder form.
export default function CvTextareaField({
  name,
  className,
  ...props
}: CvTextareaFieldProps) {
  const background = useFieldBackground();
  const id = useFieldId(name);

  return (
    <Controller<CvBuilderValues>
      name={name}
      render={({ field, fieldState }) => (
        <TextareaField
          {...props}
          {...field}
          id={id}
          value={String(field.value ?? '')}
          error={fieldState.error?.message}
          className={cn('rounded-2xl p-4 leading-5', background, className)}
        />
      )}
    />
  );
}
