'use client';

import type { ComponentProps } from 'react';
import { Controller, type FieldPath } from 'react-hook-form';
import { InputField } from '@/shared/components/InputField';
import { cn } from '@/shared/lib/utils';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import { useFieldBackground, useFieldId } from './field-surface';

type CvTextFieldProps = Omit<
  ComponentProps<typeof InputField>,
  'id' | 'name' | 'value' | 'onChange' | 'onBlur' | 'error'
> & {
  name: FieldPath<CvBuilderValues>;
};

// Text / email / month / date input bound to the CV builder form.
export default function CvTextField({
  name,
  className,
  ...props
}: CvTextFieldProps) {
  const background = useFieldBackground();
  const id = useFieldId(name);

  return (
    <Controller<CvBuilderValues>
      name={name}
      render={({ field, fieldState }) => (
        <InputField
          {...props}
          {...field}
          id={id}
          value={String(field.value ?? '')}
          error={fieldState.error?.message}
          className={cn(background, className)}
        />
      )}
    />
  );
}
