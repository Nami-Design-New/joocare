'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { INTERVIEW_METHODS } from '../../constants/shared-review-preview-data';
import type { InterviewMethod } from '../../types/shared-review.types';

type InterviewMethodOptionsProps = {
  id: string;
  value: InterviewMethod;
  onChange: (value: InterviewMethod) => void;
};

export default function InterviewMethodOptions({
  id,
  value,
  onChange,
}: InterviewMethodOptionsProps) {
  const t = useTranslations('companyPage.projects.shared-review');
  const labelId = `${id}-label`;

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="mx-1 font-semibold">
        {t('interview-method')}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {INTERVIEW_METHODS.map((method) => {
          const isSelected = value === method;
          return (
            <button
              key={method}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(method)}
              className={cn(
                'flex h-13 items-center gap-2.5 rounded-full border px-4 text-sm transition-colors',
                isSelected
                  ? 'border-[1.5px] border-primary bg-primary-bg font-semibold text-primary'
                  : 'border-transparent bg-muted text-foreground hover:bg-secondary/10',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'size-4.5 shrink-0 rounded-full bg-white',
                  isSelected
                    ? 'border-[5px] border-primary'
                    : 'border-[1.5px] border-secondary/40 bg-transparent',
                )}
              />
              {t(method)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
