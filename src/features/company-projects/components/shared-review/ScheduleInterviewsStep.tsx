'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import type { SharedReviewCandidate } from '../../types/shared-review.types';
import {
  createScheduleInterviewsSchema,
  type TScheduleInterviewsSchema,
} from '../../validation/schedule-interviews-schema';
import ScheduleInterviewCard from './ScheduleInterviewCard';
import SharedReviewTitle from './SharedReviewTitle';

type ScheduleInterviewsStepProps = {
  projectName: string;
  candidates: SharedReviewCandidate[];
  onBack: () => void;
  onSubmit: (values: TScheduleInterviewsSchema) => void;
};

export default function ScheduleInterviewsStep({
  projectName,
  candidates,
  onBack,
  onSubmit,
}: ScheduleInterviewsStepProps) {
  const t = useTranslations('companyPage.projects.shared-review');
  const schema = useMemo(
    () =>
      createScheduleInterviewsSchema({
        dateRequired: t('date-required'),
        timeRequired: t('time-required'),
      }),
    [t],
  );
  const form = useForm<TScheduleInterviewsSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      interviews: candidates.map((candidate) => ({
        candidateId: candidate.id,
        date: '',
        time: '',
        method: 'online',
        note: '',
      })),
    },
  });

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 md:gap-11"
      >
        <SharedReviewTitle
          eyebrow={t('schedule-eyebrow', { project: projectName })}
          title={t('schedule-title')}
          description={t('schedule-description')}
        />

        <ul className="flex flex-col gap-4">
          {candidates.map((candidate, index) => (
            <li key={candidate.id}>
              <ScheduleInterviewCard candidate={candidate} index={index} />
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            size="pill"
            onClick={onBack}
            className="h-12.5 px-10 text-sm font-semibold"
          >
            {t('back')}
          </Button>
          <Button
            type="submit"
            size="pill"
            disabled={form.formState.isSubmitting}
            className="h-12.5 px-8 text-sm font-semibold"
          >
            {t('submit')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
