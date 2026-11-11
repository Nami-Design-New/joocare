'use client';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AssessmentPreviewDialog from '@/features/company-assessments/components/details/AssessmentPreviewDialog';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { useAssessmentOptions } from '../../hooks/useAssessmentOptions';
import type { JobFormData } from '../../validation/job-post-schema';

type JobAssessmentFieldsProps = {
  translateError: (message?: string) => string | undefined;
};

const RESET = { shouldValidate: true } as const;

// Step 1 "Assessment" card (Figma 11073:43278 on, 11531:108027 off).
export default function JobAssessmentFields({
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
  const [previewId, setPreviewId] = useState<string | null>(null);
  const enabled = watch('assessmentEnabled');
  const source = watch('assessmentSource');
  const categoryId = watch('assessmentCategoryId');
  const assessmentId = watch('assessmentId');
  const { libraryOptions, categoryOptions, assessmentOptions } =
    useAssessmentOptions(source, categoryId);

  return (
    <div className="rounded-[12px] bg-muted p-3">
      <h6 className="mb-5 font-semibold text-gray-45">{t('title')}</h6>
      <Controller
        control={control}
        name="assessmentEnabled"
        render={({ field }) => (
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-lg font-semibold text-foreground">
              {t('link-label')}
            </span>
            <Switch
              checked={field.value}
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
      {enabled ? (
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
                options={libraryOptions.map((value) => ({
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
                  options={categoryOptions}
                  disabled={!source}
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
                  options={assessmentOptions}
                  disabled={!categoryId}
                  error={translateError(errors.assessmentId?.message)}
                />
              )}
            />
            <Button
              type="button"
              size="icon"
              aria-label={t('preview')}
              disabled={!assessmentId}
              onClick={() => setPreviewId(assessmentId ?? null)}
              className="size-13 rounded-full bg-secondary text-white hover:bg-secondary/90"
            >
              <Eye aria-hidden="true" className="size-5" />
            </Button>
          </div>
        </div>
      ) : null}
      <AssessmentPreviewDialog
        assessmentId={previewId}
        onClose={() => setPreviewId(null)}
      />
    </div>
  );
}
