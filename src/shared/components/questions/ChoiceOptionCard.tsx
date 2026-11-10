'use client';

import type { ReactNode, Ref } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type ChoiceOptionCardProps = {
  type: 'radio' | 'checkbox';
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  /** Leading marker before the label, e.g. "A." */
  marker?: string;
  invalid?: boolean;
  disabled?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  className?: string;
};

// A selectable answer row (radio or checkbox) used by screening questions and assessments.
export default function ChoiceOptionCard({
  type,
  name,
  value,
  checked,
  onChange,
  label,
  marker,
  invalid = false,
  disabled = false,
  inputRef,
  className,
}: ChoiceOptionCardProps) {
  return (
    <label
      className={cn(
        'has-focus-visible:ring-ring/40 flex min-h-13 cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors has-focus-visible:ring-[3px]',
        checked
          ? 'border-assessment-primary bg-assessment-primary/4'
          : 'border-border bg-card hover:bg-muted/60',
        invalid && !checked && 'border-destructive/60',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      {type === 'radio' ? (
        <RadioIndicator checked={checked} />
      ) : (
        <CheckboxIndicator checked={checked} />
      )}
      {marker ? (
        <bdi className="text-foreground shrink-0 text-base font-semibold">
          {marker}
        </bdi>
      ) : null}
      <span className="text-foreground min-w-0 flex-1 text-base leading-5">
        {label}
      </span>
    </label>
  );
}

function RadioIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded-full border',
        checked ? 'border-assessment-primary' : 'border-foreground/45',
      )}
    >
      {checked ? (
        <span className="bg-assessment-primary size-2 rounded-full" />
      ) : null}
    </span>
  );
}

function CheckboxIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        // A literal radius: `rounded-sm` resolves through this theme's large `--radius-sm`
        // token (8px), which makes a 20px box look like a circle instead of a checkbox.
        'flex size-5 shrink-0 items-center justify-center rounded-[4px] border',
        checked
          ? 'border-assessment-primary bg-assessment-primary text-primary-foreground'
          : 'border-foreground/45 bg-muted',
      )}
    >
      {checked ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
    </span>
  );
}
