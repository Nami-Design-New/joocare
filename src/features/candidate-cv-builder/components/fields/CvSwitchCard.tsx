'use client';

import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { Controller, type FieldPath } from 'react-hook-form';
import { Switch } from '@/shared/components/ui/switch';
import { cn } from '@/shared/lib/utils';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import { useFieldId } from './field-surface';

const switchCardVariants = cva('bg-card flex flex-col', {
  variants: {
    variant: {
      /** Standalone yes/no row (license, availability, fresh graduate). */
      row: 'gap-3 rounded-xl px-4 py-2',
      /** Section whose switch reveals entries (research, CPD). */
      section: 'gap-3 rounded-2xl p-3 [&>[data-switch-row]]:py-2',
    },
  },
  defaultVariants: { variant: 'row' },
});

type CvSwitchCardProps = {
  name: FieldPath<CvBuilderValues>;
  title: string;
  description: string;
  onCheckedChange?: (checked: boolean) => void;
  variant?: 'row' | 'section';
  /** Content shown under the switch (e.g. the fields it enables). */
  children?: ReactNode;
  className?: string;
};

// White card with a yes/no switch: license, availability, fresh graduate, research, CPD.
export default function CvSwitchCard({
  name,
  title,
  description,
  onCheckedChange,
  variant,
  children,
  className,
}: CvSwitchCardProps) {
  const id = useFieldId(`${name}-switch`);

  return (
    <div className={cn(switchCardVariants({ variant }), className)}>
      <div data-switch-row className="flex items-start gap-3">
        <Controller<CvBuilderValues>
          name={name}
          render={({ field }) => (
            <Switch
              id={id}
              ref={field.ref}
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                onCheckedChange?.(checked);
              }}
              aria-describedby={`${id}-description`}
              className="data-[state=checked]:bg-cv-builder-primary data-[state=unchecked]:bg-foreground/35 mt-0.5 px-0.5 data-[size=default]:h-5.5 data-[size=default]:w-10 [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-4.5 rtl:[&_[data-slot=switch-thumb]]:data-[state=checked]:-translate-x-4.5"
            />
          )}
        />
        <div className="flex flex-col gap-1">
          <label
            htmlFor={id}
            className="text-foreground text-base leading-5 font-semibold"
          >
            {title}
          </label>
          <p
            id={`${id}-description`}
            className="text-foreground/45 text-sm leading-4.5"
          >
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
