'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useGetAssessmentCategories } from '@/features/company-assessments/hooks/useGetAssessmentCategories';
import { useGetCategoryAssessmentOptions } from '@/features/company-assessments/hooks/useGetCategoryAssessmentOptions';
import type { AssessmentSource } from '@/features/company-assessments/types/assessment.types';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Switch } from '@/shared/components/ui/switch';
import type { JobFormData } from '../../validation/job-post-schema';
import AssessmentPreviewButton from './AssessmentPreviewButton';
import LockedAssessmentFields from './LockedAssessmentFields';

type JobAssessmentFieldsProps = {
  translateError: (message?: string) => string | undefined;
};

const LIBRARIES: AssessmentSource[] = ['joocare', 'company'];
const RESET = { shouldValidate: true } as const;

function isAssessmentSource(value?: string): value is AssessmentSource {
  return LIBRARIES.some((library) => library === value);
}

// Step 1 "Assessment" card (Figma 11073:43278 on, 11531:108027 off).
export default function JobAssessmentFields({
  translateError,
}: JobAssessmentFieldsProps) {
  const t = useTranslations('companyPage.postJob.assessment');
  const { control, watch, setValue } = useFormContext<JobFormData>();
  const enabled = watch('assessmentEnabled');
  const locked = watch('assessmentLocked');
  const assessmentId = watch('assessmentId');

  return (
    <div className="rounded-[12px] bg-muted p-3">
      <h6 className="mb-5 font-semibold text-gray-45">{t('title')}</h6>
      <Controller
        control={control}
        name="assessmentEnabled"
        render={({ field }) => (
          <label className="flex cursor-pointer items-center justify-between gap-4 has-disabled:cursor-not-allowed">
            <span className="text-lg font-semibold text-foreground">
              {t('link-label')}
            </span>
            <Switch
              checked={field.value}
              disabled={locked}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (checked) return;
                setValue('assessmentSource', '', RESET);
                setValue('assessmentCategoryId', '', RESET);
                setValue('assessmentId', '', RESET);
              }}
            />
          </label>
        )}
      />
      {locked ? (
        <p className="mt-2 text-sm text-muted-foreground">{t('locked-hint')}</p>
      ) : null}
      {enabled && locked && assessmentId ? (
        <LockedAssessmentFields assessmentId={assessmentId} />
      ) : null}
      {enabled && !locked ? (
        <EditableAssessmentFields translateError={translateError} />
      ) : null}
    </div>
  );
}

function EditableAssessmentFields({
  translateError,
}: JobAssessmentFieldsProps) {
  const t = useTranslations('companyPage.postJob.assessment');
  const tCommon = useTranslations('common');
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<JobFormData>();
  const source = watch('assessmentSource');
  const categoryId = watch('assessmentCategoryId') ?? '';
  const assessmentId = watch('assessmentId');
  const categories = useGetAssessmentCategories(
    isAssessmentSource(source) ? source : 'company',
    { enabled: isAssessmentSource(source) },
  );
  const assessments = useGetCategoryAssessmentOptions(categoryId);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Controller
        control={control}
        name="assessmentSource"
        render={({ field }) => (
          <SelectInputField
            {...field}
            id="assessment-library"
            className="bg-white"
            label={t('library-label')}
            placeholder={tCommon('select')}
            options={LIBRARIES.map((value) => ({
              value,
              label: t(`library-${value}`),
            }))}
            error={translateError(errors.assessmentSource?.message)}
            onChange={(value) => {
              field.onChange(value);
              setValue('assessmentCategoryId', '', RESET);
              setValue('assessmentId', '', RESET);
            }}
          />
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Controller
          control={control}
          name="assessmentCategoryId"
          render={({ field }) => (
            <SelectInputField
              {...field}
              id="assessment-category"
              className="bg-white"
              label={t('category-label')}
              placeholder={tCommon('select')}
              options={categories.categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              disabled={!source}
              hasNextPage={categories.hasNextPage}
              isFetchingNextPage={categories.isFetchingNextPage}
              onReachEnd={() => void categories.fetchNextPage()}
              error={translateError(errors.assessmentCategoryId?.message)}
              onChange={(value) => {
                field.onChange(value);
                setValue('assessmentId', '', RESET);
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="assessmentId"
          render={({ field }) => (
            <SelectInputField
              {...field}
              id="assessment-select"
              className="bg-white"
              label={t('assessment-label')}
              placeholder={tCommon('select')}
              options={assessments.assessments.map((assessment) => ({
                value: assessment.id,
                label: assessment.title,
              }))}
              disabled={!categoryId}
              hasNextPage={assessments.hasNextPage}
              isFetchingNextPage={assessments.isFetchingNextPage}
              onReachEnd={() => void assessments.fetchNextPage()}
              error={translateError(errors.assessmentId?.message)}
            />
          )}
        />
        <AssessmentPreviewButton assessmentId={assessmentId} />
      </div>
    </div>
  );
}
