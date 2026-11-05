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
        'bg-question-card-surface border-question-card-border flex flex-col self-start rounded-3xl border-[1.5px] p-6 shadow-[0_2px_8px_0_oklch(0_0_0/4%)]',
        className,
      )}
    >
      <div className="flex items-start gap-5">
        <span className="bg-question-card-icon-bg flex size-11 shrink-0 items-center justify-center rounded-xl">
          <Image src={icon} width={24} height={24} alt="" className="size-6" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-question-card-title text-[21px] leading-[26px] font-semibold">
            {title}
          </h3>
          <p className="text-question-card-text min-h-12 text-base leading-6">{description}</p>
        </div>
      </div>

      <fieldset className="flex flex-wrap items-center gap-14 py-4 ps-2">
        <legend className="sr-only">{title}</legend>
        {ANSWERS.map((answer) => (
          <label
            key={answer}
            className="text-question-card-title flex cursor-pointer items-center gap-3.5 text-base"
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
                'peer-focus-visible:ring-ring/50 size-6 shrink-0 rounded-full peer-focus-visible:ring-[3px]',
                value === answer
                  ? 'border-question-card-accent border-[5px]'
                  : 'border-question-card-radio border-2',
              )}
            />
            {t(answer)}
          </label>
        ))}
        {clearable && value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-primary cursor-pointer text-sm underline"
          >
            {t('clear')}
          </button>
        )}
      </fieldset>

      {value === 'yes' && (children || hint) && (
        <div className="border-question-card-border flex flex-col gap-3 border-t pt-6">
          {children}
          {hint && <p className="text-question-card-hint text-sm">{hint}</p>}
        </div>
      )}
    </section>
  );
}
