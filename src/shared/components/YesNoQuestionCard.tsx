'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '../lib/utils';

export type YesNoValue = 'yes' | 'no' | '';

type YesNoQuestionCardProps = {
  name: string;
  /** Icon image path. */
  icon: string;
  title: string;
  description: string;
  value: YesNoValue;
  onChange: (value: YesNoValue) => void;
  /** Shows a "Clear" action when an answer is picked (used by filters). */
  clearable?: boolean;
  /** Follow-up content shown for Yes, e.g. a countries field. */
  children?: ReactNode;
  hint?: string;
  className?: string;
};

const ANSWERS = ['yes', 'no'] as const;

// A yes / no question card (relocation, driving license) with optional follow-up fields.
export default function YesNoQuestionCard({
  name,
  icon,
  title,
  description,
  value,
  onChange,
  clearable = false,
  children,
  hint,
  className,
}: YesNoQuestionCardProps) {
  const t = useTranslations('common');

  return (
    <section
      className={cn(
        'flex flex-col self-start rounded-3xl border-[1.5px] border-question-card-border bg-question-card-surface p-4 shadow-[0_2px_8px_0_oklch(0_0_0/4%)] sm:p-6',
        className,
      )}
    >
      <div className="flex items-start gap-3 sm:gap-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-question-card-icon-bg">
          <Image src={icon} width={24} height={24} alt="" className="size-6" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg leading-6 font-semibold text-question-card-title sm:text-[21px] sm:leading-[26px]">
            {title}
          </h3>
          <p className="min-h-12 text-sm leading-5 text-question-card-text sm:text-base sm:leading-6">
            {description}
          </p>
        </div>
      </div>

      <fieldset className="flex flex-wrap items-center gap-8 py-4 ps-2 sm:gap-14">
        <legend className="sr-only">{title}</legend>
        {ANSWERS.map((answer) => (
          <label
            key={answer}
            className="flex cursor-pointer items-center gap-3.5 text-base text-question-card-title"
          >
            <input
              type="radio"
              name={name}
              value={answer}
              checked={value === answer}
              onChange={() => onChange(answer)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                'size-6 shrink-0 rounded-full peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50',
                value === answer
                  ? 'border-[5px] border-question-card-accent'
                  : 'border-2 border-question-card-radio',
              )}
            />
            {t(answer)}
          </label>
        ))}
        {clearable && value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="cursor-pointer text-sm text-primary underline"
          >
            {t('clear')}
          </button>
        )}
      </fieldset>

      {value === 'yes' && (children || hint) && (
        <div className="flex flex-col gap-3 border-t border-question-card-border pt-6">
          {children}
          {hint && <p className="text-sm text-question-card-hint">{hint}</p>}
        </div>
      )}
    </section>
  );
}
