'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { TextareaField } from '@/shared/components/TextareaField';
import type { AssessmentConfiguration } from '../../types/assessment-builder.types';

export default function AssessmentConfigurationStep() {
  const t = useTranslations('companyPage.assessments.builder');
  const {
    register,
    formState: { errors },
  } = useFormContext<AssessmentConfiguration>();
  return (
    <div className="bg-card space-y-8 rounded-2xl p-5 md:p-8">
      <section className="space-y-5">
        <h2 className="text-muted-foreground border-border border-b pb-2 text-lg font-semibold">
          {t('basic-information')}
        </h2>
        <InputField
          id="assessment-title"
          label={t('name')}
          placeholder={t('name-placeholder')}
          error={errors.title?.message}
          {...register('title')}
          className="shadow-none"
        />
        <TextareaField
          id="assessment-description"
          label={t('description')}
          placeholder={t('description-placeholder')}
          error={errors.description?.message}
          {...register('description')}
          className="bg-muted min-h-25 resize-y rounded-2xl p-4 shadow-none"
        />
      </section>
      <section className="space-y-5">
        <h2 className="text-muted-foreground border-border border-b pb-2 text-lg font-semibold">
          {t('settings')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="assessment-pass-score"
            label={t('passing-score')}
            type="number"
            min={1}
            max={100}
            error={errors.passScore?.message}
            {...register('passScore')}
            className="shadow-none"
          />
          <InputField
            id="assessment-duration"
            label={t('time-limit')}
            type="number"
            min={1}
            step={1}
            error={errors.durationMinutes?.message}
            {...register('durationMinutes')}
            className="shadow-none"
          />
        </div>
      </section>
    </div>
  );
}
