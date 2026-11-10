'use client';

import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { InputField } from '@/shared/components/InputField';
import LabelCheckbox from '@/shared/components/LabelCheckbox';
import {
  SelectInputField,
  type Option,
} from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { typedZodResolver } from '@/shared/lib/typed-zod-resolver';

export type ExperienceFormValues = {
  /** Selected option value; `otherJobTitleValue` means a free-text title. */
  jobTitle: string;
  otherJobTitle: string;
  organization: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: { value: string }[];
};

export const EMPTY_EXPERIENCE_FORM: ExperienceFormValues = {
  jobTitle: '',
  otherJobTitle: '',
  organization: '',
  employmentType: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  responsibilities: [{ value: '' }],
};

/** Options of a select and, for API lookups, its search / paging state. */
export type ExperienceSelectField = {
  options: Option[];
  isLoading?: boolean;
  error?: string;
  onSearchChange?: (search: string) => void;
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

type ExperienceFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitLabel: string;
  /** Validation for one experience entry. */
  schema: z.ZodType<ExperienceFormValues>;
  /** Values the form is (re)filled with each time the modal opens. */
  defaultValues?: ExperienceFormValues;
  /** Saves the entry; the caller closes the modal on success and reports errors. */
  onSubmit: (values: ExperienceFormValues) => void | Promise<void>;
  /** Job title options; must include the "Other" option. */
  jobTitleField: ExperienceSelectField;
  /** Value of the "Other" job title option (shows the free-text title). */
  otherJobTitleValue: string;
  employmentTypeField: ExperienceSelectField;
  /** `date` (day precision) or `month` (month and year). */
  dateType?: 'date' | 'month';
};

const ROUND_BUTTON = 'h-13 w-15 shrink-0 rounded-full';

// Add / edit work experience modal. The design is fixed here; data, validation and saving come from the caller.
export default function ExperienceFormModal({
  open,
  onOpenChange,
  title,
  submitLabel,
  schema,
  defaultValues = EMPTY_EXPERIENCE_FORM,
  onSubmit,
  jobTitleField,
  otherJobTitleValue,
  employmentTypeField,
  dateType = 'date',
}: ExperienceFormModalProps) {
  const t = useTranslations();
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: typedZodResolver(schema),
    defaultValues,
  });
  const responsibilities = useFieldArray({ control, name: 'responsibilities' });
  const [jobTitle, otherJobTitle, currentlyWorking] = useWatch({
    control,
    name: ['jobTitle', 'otherJobTitle', 'currentlyWorking'],
  });
  const isOtherJobTitle = jobTitle === otherJobTitleValue;
  const lastResponsibility = responsibilities.fields.length - 1;

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [defaultValues, open, reset]);

  // A saved free-text title that matches a loaded option is shown as that option (until the user edits it).
  useEffect(() => {
    if (!isOtherJobTitle || !otherJobTitle) return;
    if (getFieldState('otherJobTitle').isDirty) return;
    const normalized = otherJobTitle.trim().toLowerCase();
    const match = jobTitleField.options.find(
      (option) =>
        option.value !== otherJobTitleValue &&
        option.label.trim().toLowerCase() === normalized,
    );
    if (!match) return;
    setValue('jobTitle', match.value);
    setValue('otherJobTitle', '');
  }, [
    getFieldState,
    isOtherJobTitle,
    jobTitleField.options,
    otherJobTitle,
    otherJobTitleValue,
    setValue,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={setPortalContainer} className="max-w-175 gap-5">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl sm:text-[28px]">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form
          noValidate
          onSubmit={(event) => {
            // Keep the submit inside the modal (React events bubble to any parent form).
            event.stopPropagation();
            void handleSubmit(onSubmit)(event);
          }}
          className="flex flex-col gap-5"
        >
          <Controller
            name="jobTitle"
            control={control}
            render={({ field, fieldState }) => (
              <SelectInputField
                id="experience-job-title"
                label={t('authPage.common.job-title')}
                placeholder={
                  jobTitleField.isLoading
                    ? t('candidatePage.profile.loading-job-titles')
                    : t('candidatePage.profile.select-job-title')
                }
                options={jobTitleField.options}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  if (value !== otherJobTitleValue) {
                    setValue('otherJobTitle', '');
                  }
                }}
                disabled={jobTitleField.isLoading}
                withSearchInput
                searchPlaceholder={t('candidatePage.profile.search-job-titles')}
                onSearchChange={jobTitleField.onSearchChange}
                portalContainer={portalContainer}
                onReachEnd={jobTitleField.onReachEnd}
                hasNextPage={jobTitleField.hasNextPage}
                isFetchingNextPage={jobTitleField.isFetchingNextPage}
                error={fieldState.error?.message ?? jobTitleField.error}
              />
            )}
          />

          {isOtherJobTitle && (
            <InputField
              id="experience-other-job-title"
              label={t('authPage.common.other-job-title')}
              placeholder={t('candidatePage.profile.enter-job-title')}
              {...register('otherJobTitle')}
              error={errors.otherJobTitle?.message}
            />
          )}

          <InputField
            id="experience-organization"
            label={t('candidatePage.profile.organization-name')}
            placeholder={t('candidatePage.profile.organization-placeholder')}
            {...register('organization')}
            error={errors.organization?.message}
          />

          <Controller
            name="employmentType"
            control={control}
            render={({ field, fieldState }) => (
              <SelectInputField
                id="experience-employment-type"
                label={t('candidatePage.profile.employment-type')}
                placeholder={
                  employmentTypeField.isLoading
                    ? t('candidatePage.profile.loading-employment-types')
                    : t('candidatePage.profile.employment-type-placeholder')
                }
                options={employmentTypeField.options}
                value={field.value}
                onChange={field.onChange}
                disabled={employmentTypeField.isLoading}
                withSearchInput
                searchPlaceholder={t(
                  'candidatePage.profile.search-employment-types',
                )}
                onSearchChange={employmentTypeField.onSearchChange}
                portalContainer={portalContainer}
                onReachEnd={employmentTypeField.onReachEnd}
                hasNextPage={employmentTypeField.hasNextPage}
                isFetchingNextPage={employmentTypeField.isFetchingNextPage}
                error={fieldState.error?.message ?? employmentTypeField.error}
              />
            )}
          />

          <div className="flex gap-2 max-md:flex-col">
            <InputField
              id="experience-start-date"
              label={t('candidatePage.profile.start-date')}
              type={dateType}
              {...register('startDate')}
              error={errors.startDate?.message}
            />

            <InputField
              id="experience-end-date"
              label={t('candidatePage.profile.end-date')}
              type={dateType}
              disabled={currentlyWorking}
              {...register('endDate')}
              error={errors.endDate?.message}
            />
          </div>

          <Controller
            name="currentlyWorking"
            control={control}
            render={({ field }) => (
              <LabelCheckbox
                id="experience-currently-working"
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) setValue('endDate', '');
                }}
                error={errors.currentlyWorking?.message}
              >
                {t('candidatePage.profile.currently-work-here')}
              </LabelCheckbox>
            )}
          />

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">
              {t('candidatePage.profile.responsibilities')}
            </span>

            {responsibilities.fields.map((item, index) => (
              <div key={item.id} className="flex items-end gap-2">
                <InputField
                  id={`experience-responsibility-${index}`}
                  aria-label={t('candidatePage.profile.responsibilities')}
                  placeholder={t(
                    'candidatePage.profile.responsibilities-placeholder',
                  )}
                  {...register(`responsibilities.${index}.value`)}
                  error={errors.responsibilities?.[index]?.value?.message}
                />

                {index === lastResponsibility ? (
                  <Button
                    type="button"
                    variant="secondary"
                    aria-label={t('candidatePage.profile.add-responsibility')}
                    onClick={() => responsibilities.append({ value: '' })}
                    className={ROUND_BUTTON}
                  >
                    <Plus className="size-6" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={t('candidatePage.profile.remove-responsibility')}
                    onClick={() => responsibilities.remove(index)}
                    className={`bg-muted text-secondary ${ROUND_BUTTON}`}
                  >
                    <Minus className="size-6" />
                  </Button>
                )}
              </div>
            ))}
            {errors.responsibilities?.root?.message ||
            errors.responsibilities?.message ? (
              <p className="text-destructive text-xs">
                {errors.responsibilities?.root?.message ??
                  errors.responsibilities?.message}
              </p>
            ) : null}
          </div>

          <DialogFooter className="flex items-center justify-center!">
            <Button
              className="hover:bg-primary/70 w-1/3"
              size="pill"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('candidatePage.common.saving') : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
