'use client';

import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { SUGGESTED_SUMMARIES } from '../../constants/cv-builder-preview-data';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import CvStepCard from '../wizard/CvStepCard';

// Step 4: professional summary with a suggested text (Refresh cycles, Apply copies it).
export default function ProfessionalSummaryStep() {
  const t = useTranslations('candidatePage.buildCv.summary');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const { setValue } = useFormContext<CvBuilderValues>();
  const { errors } = useFormState<CvBuilderValues>({ name: 'summary.text' });
  const error = errors.summary?.text?.message;
  const suggestion = SUGGESTED_SUMMARIES[suggestionIndex];

  return (
    <CvStepCard title={t('title')} description={t('description')}>
      <div className="flex flex-col">
        <div className="bg-card border-border overflow-hidden rounded-3xl border">
          <Controller<CvBuilderValues, 'summary.text'>
            name="summary.text"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                id="summary-text"
                aria-label={t('label')}
                placeholder={t('placeholder')}
                aria-invalid={Boolean(fieldState.error)}
                aria-describedby={error ? 'summary-text-error' : undefined}
                className="h-42.5 resize-none rounded-none border-0 bg-transparent p-4 text-base shadow-none focus-visible:ring-0"
              />
            )}
          />
          <div className="border-border border-t p-3">
            <section
              aria-label={t('suggestion-label')}
              className="bg-cv-builder-primary/8 flex flex-col gap-8 rounded-2xl p-3"
            >
              <p className="text-foreground text-base leading-5">
                {suggestion}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="pill"
                  onClick={() =>
                    setSuggestionIndex(
                      (index) => (index + 1) % SUGGESTED_SUMMARIES.length,
                    )
                  }
                  className="bg-card text-foreground border-border h-10 gap-2 px-5 font-normal"
                >
                  <RefreshCw aria-hidden className="size-5" />
                  {t('refresh')}
                </Button>
                <Button
                  type="button"
                  size="pill"
                  onClick={() =>
                    setValue('summary.text', suggestion, {
                      shouldValidate: true,
                    })
                  }
                  className="bg-cv-builder-primary hover:bg-cv-builder-primary/90 h-12.5 w-full font-semibold sm:w-56"
                >
                  {t('apply')}
                </Button>
              </div>
            </section>
          </div>
        </div>
        {error && (
          <span
            id="summary-text-error"
            className="text-destructive mt-1 text-xs"
          >
            {error}
          </span>
        )}
      </div>
    </CvStepCard>
  );
}
