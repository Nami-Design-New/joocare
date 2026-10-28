import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

type AssessmentProgressProps = { step: number };

export default function AssessmentProgress({ step }: AssessmentProgressProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const steps = [t('configuration'), t('questions'), t('review')];
  return (
    <nav aria-label={t('progress')} className="mb-10 md:mb-12">
      <div className="flex items-center" aria-hidden="true">
        {steps.map((label, index) => (
          <Fragment key={label}>
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full text-lg font-semibold',
                index <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {index + 1}
            </span>
            {index < steps.length - 1 && (
              <span
                className={cn(
                  'h-2 flex-1',
                  index < step ? 'bg-primary' : 'bg-muted',
                )}
              />
            )}
          </Fragment>
        ))}
      </div>
      <ol className="mt-3 flex justify-between text-xs md:text-base">
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? 'step' : undefined}
            className={cn(index > step && 'text-muted-foreground')}
          >
            {label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
