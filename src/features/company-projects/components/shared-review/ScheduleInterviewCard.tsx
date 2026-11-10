'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';
import { InputField } from '@/shared/components/InputField';
import { TextareaField } from '@/shared/components/TextareaField';
import type { SharedReviewCandidate } from '../../types/shared-review.types';
import type { TScheduleInterviewsSchema } from '../../validation/schedule-interviews-schema';
import InterviewMethodOptions from './InterviewMethodOptions';
import ReviewCandidateIdentity from './ReviewCandidateIdentity';

type ScheduleInterviewCardProps = {
  candidate: SharedReviewCandidate;
  index: number;
};

export default function ScheduleInterviewCard({
  candidate,
  index,
}: ScheduleInterviewCardProps) {
  const t = useTranslations('companyPage.projects.shared-review');
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TScheduleInterviewsSchema>();
  const fieldErrors = errors.interviews?.[index];
  const fieldId = (name: string) => `${candidate.id}-${name}`;

  return (
    <article className="bg-card border-border flex flex-col gap-5 rounded-xl border p-4 md:p-6">
      <ReviewCandidateIdentity candidate={candidate} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputField
            id={fieldId('date')}
            type="date"
            label={t('date')}
            {...register(`interviews.${index}.date`)}
            error={fieldErrors?.date?.message}
          />
          <InputField
            id={fieldId('time')}
            type="time"
            label={t('time')}
            {...register(`interviews.${index}.time`)}
            error={fieldErrors?.time?.message}
          />
        </div>
        <Controller
          name={`interviews.${index}.method`}
          control={control}
          render={({ field }) => (
            <InterviewMethodOptions
              id={fieldId('method')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <TextareaField
        id={fieldId('note')}
        label={t('note-label')}
        hint={t('optional')}
        placeholder={t('note-placeholder')}
        {...register(`interviews.${index}.note`)}
        className="bg-muted min-h-24 rounded-2xl border-0 px-4 py-3.5 shadow-none"
      />
    </article>
  );
}
