'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { CV_BUILDER_STEPS } from '../../constants';
import type { CvBuilderWizard } from '../../hooks/useCvBuilderWizard';

type CvBuilderStepperProps = {
  wizard: CvBuilderWizard;
};

// Horizontal (mobile/tablet): numbered circles + horizontal connectors, no labels.
// Vertical (lg+): numbered circles + vertical connectors + labels.
export default function CvBuilderStepper({ wizard }: CvBuilderStepperProps) {
  const t = useTranslations('candidatePage.buildCv');

  return (
    <nav aria-label={t('wizard.steps-label')}>
      <ol className="flex items-center justify-between gap-0 overflow-x-auto lg:flex-col lg:items-start lg:justify-start lg:gap-0 lg:overflow-visible">
        {CV_BUILDER_STEPS.map((step, index) => {
          const isActive = index === wizard.stepIndex;
          const isCompleted = wizard.isStepCompleted(index);
          const isReached = isActive || isCompleted;
          const isLast = index === CV_BUILDER_STEPS.length - 1;
          const label = t(`steps.${step.label}`);

          return (
            <li
              key={step.key}
              className={cn(
                'relative flex shrink-0 items-center',
                // Mobile/tablet: each item (except last) stretches to fill space
                !isLast && 'flex-1',
                // Desktop: vertical column with bottom padding
                'lg:flex-none lg:items-start lg:pb-12.5 lg:last:pb-0',
              )}
            >
              {/* Connector line — from right edge of this circle to left edge of next circle */}
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    // Mobile/tablet: horizontal, starts after this circle, reaches to where the next circle begins
                    'absolute start-8.5 end-0 top-3.25 h-2',
                    // Desktop: vertical, starts below this circle, stops before next circle top
                    'lg:start-3.25 lg:end-auto lg:top-8 lg:bottom-0 lg:w-2 lg:h-auto',
                    isCompleted ? 'bg-cv-builder-primary' : 'bg-muted',
                  )}
                />
              )}

              {/* Circle button — z-10 so it renders above the connector line */}
              <button
                type="button"
                onClick={() => wizard.goToStep(index)}
                disabled={!wizard.canOpenStep(index)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={label}
                className="relative z-10 flex items-center gap-2.5 text-start disabled:cursor-default"
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

                {/* Label: hidden on mobile/tablet, visible on lg+ */}
                <span
                  className={cn(
                    'hidden text-lg leading-6 lg:block',
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
