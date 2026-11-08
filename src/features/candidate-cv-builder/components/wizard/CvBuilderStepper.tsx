'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { CV_BUILDER_STEPS } from '../../constants';
import type { CvBuilderWizard } from '../../hooks/useCvBuilderWizard';

type CvBuilderStepperProps = {
  wizard: CvBuilderWizard;
};

// Vertical 10-step stepper (a compact row of numbers on small screens).
export default function CvBuilderStepper({ wizard }: CvBuilderStepperProps) {
  const t = useTranslations('candidatePage.buildCv');

  return (
    <nav aria-label={t('wizard.steps-label')}>
      <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
        {CV_BUILDER_STEPS.map((step, index) => {
          const isActive = index === wizard.stepIndex;
          const isReached = isActive || wizard.isStepCompleted(index);
          const label = t(`steps.${step.label}`);

          return (
            <li
              key={step.key}
              className="relative shrink-0 lg:pb-12.5 lg:last:pb-0"
            >
              {index < CV_BUILDER_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute start-3.25 top-8 bottom-0 w-2 max-lg:hidden',
                    index < wizard.stepIndex
                      ? 'bg-cv-builder-primary'
                      : 'bg-muted',
                  )}
                />
              )}
              <button
                type="button"
                onClick={() => wizard.goToStep(index)}
                disabled={!wizard.canOpenStep(index)}
                aria-current={isActive ? 'step' : undefined}
                className="relative flex items-center gap-2.5 text-start disabled:cursor-default"
              >
                <span
                  className={cn(
                    'flex size-8.5 shrink-0 items-center justify-center rounded-full text-lg font-semibold',
                    isReached
                      ? 'bg-cv-builder-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    'text-lg leading-6 max-lg:sr-only',
                    isReached ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
