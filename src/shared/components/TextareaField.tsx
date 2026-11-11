'use client';
import * as React from 'react';

import { cn } from '../lib/utils';
import { Textarea } from './ui/textarea';

type TextareaFieldProps = {
  label?: string;
  id: string;
  error?: string | boolean;
  containerStyles?: string;
  disabled?: boolean;
  hint?: string;
} & React.ComponentProps<'textarea'>;

export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      label,
      id,
      className,
      error,
      containerStyles,
      disabled = false,
      hint,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn('flex w-full flex-col', containerStyles)}>
        {label && (
          <label htmlFor={id} className="mx-1 mb-1 font-semibold">
            {label}
            {hint && (
              <span className="ms-2 text-[13px] font-normal text-muted-foreground">
                {hint}
              </span>
            )}
          </label>
        )}

        <Textarea
          id={id}
          ref={ref}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(className)}
          {...props}
        />

        {error && (
          <span className="mt-1 text-[12px] text-destructive">{error}</span>
        )}
      </div>
    );
  },
);

TextareaField.displayName = 'TextareaField';
