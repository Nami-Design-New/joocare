'use client';

import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import {
  assessmentSeeds,
  categorySeeds,
} from '../../constants/assessment-data';
import type { AssessmentCandidateSummary } from '../../types/candidate-assessment.types';
import {
  createAssignAssessmentSchema,
  type TAssignAssessmentSchema,
} from '../../validation/assign-assessment-schema';
import CandidateModalHeader from './CandidateModalHeader';
import CandidateSummaryCard from './CandidateSummaryCard';

type AssignAssessmentModalProps = {
  candidate: AssessmentCandidateSummary;
  onClose: () => void;
  onAssign: (values: TAssignAssessmentSchema) => Promise<void>;
};

const categoryOptions = categorySeeds.map((category) => ({
  value: category.id,
  label: category.name,
}));

export default function AssignAssessmentModal({
  candidate,
  onClose,
  onAssign,
}: AssignAssessmentModalProps) {
  const t = useTranslations('companyPage.assessments.candidate-assessments');
  const schema = useMemo(
    () =>
      createAssignAssessmentSchema({
        categoryRequired: t('category-required'),
        assessmentRequired: t('assessment-required'),
      }),
    [t],
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TAssignAssessmentSchema>({
    resolver: zodResolver(schema),
    defaultValues: { categoryId: '', assessmentId: '' },
  });
  const categoryId = useWatch({ control, name: 'categoryId' });
  const assessmentOptions = assessmentSeeds
    .filter((assessment) => assessment.categoryId === categoryId)
    .map((assessment) => ({
      value: assessment.id,
      label: t('assessment-option', {
        title: assessment.title,
        questions: assessment.questionCount,
        minutes: assessment.durationMinutes,
      }),
    }));

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="bg-card w-[calc(100%-2rem)] max-w-195 gap-6 rounded-3xl border-0 p-6 sm:min-w-0"
      >
        <CandidateModalHeader
          title={t('assign-title')}
          disabled={isSubmitting}
        />
        <DialogDescription className="sr-only">
          {t('assign-description', { name: candidate.name })}
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onAssign)}
          className="flex flex-col gap-6"
          aria-busy={isSubmitting}
        >
          <section className="flex flex-col gap-3">
            <h3 className="font-semibold">{t('candidate')}</h3>
            <CandidateSummaryCard candidate={candidate} />
          </section>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <SelectInputField
                id="assign-assessment-category"
                label={t('category')}
                placeholder={t('category-placeholder')}
                options={categoryOptions}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue('assessmentId', '');
                }}
                disabled={isSubmitting}
                error={errors.categoryId?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="assessmentId"
            render={({ field }) => (
              <SelectInputField
                id="assign-assessment-assessment"
                label={t('assessment')}
                placeholder={t(
                  categoryId ? 'assessment-placeholder' : 'choose-category-first',
                )}
                options={assessmentOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={isSubmitting || !categoryId}
                error={errors.assessmentId?.message}
              />
            )}
          />
          <aside className="border-assessment-link-info-border bg-assessment-link-info text-assessment-link-info-text flex items-start gap-3 rounded-xl border p-4 text-xs leading-relaxed">
            <Info aria-hidden className="mt-0.5 size-4.5 shrink-0" />
            <div>
              <h4 className="mb-1 font-semibold">{t('how-it-works')}</h4>
              <p>{t('how-it-works-description', { name: candidate.name })}</p>
            </div>
          </aside>
          <Button type="submit" size="pill" disabled={isSubmitting}>
            {isSubmitting && (
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
            )}
            {t(isSubmitting ? 'sending' : 'send')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
