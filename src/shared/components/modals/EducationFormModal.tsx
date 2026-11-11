'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { InputField } from '@/shared/components/InputField';
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

export type EducationFormValues = {
  degree: string;
  university: string;
  gpa: string;
  /** Country id (profile, from the API) or name (CV builder): whatever `countryField.options` use as values. */
  country: string;
  startDate: string;
  endDate: string;
};

export const EMPTY_EDUCATION_FORM: EducationFormValues = {
  degree: '',
  university: '',
  gpa: '',
  country: '',
  startDate: '',
  endDate: '',
};

/** Where the country options come from (a paginated lookup or a fixed list). */
export type EducationCountryField = {
  options: Option[];
  isLoading?: boolean;
  onSearchChange?: (search: string) => void;
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

type EducationFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitLabel: string;
  /** Validation for one education entry. */
  schema: z.ZodType<EducationFormValues>;
  /** Values the form is (re)filled with each time the modal opens. */
  defaultValues?: EducationFormValues;
  /** Saves the entry; the caller closes the modal on success and reports errors. */
  onSubmit: (values: EducationFormValues) => void | Promise<void>;
  countryField: EducationCountryField;
  /** `date` (day precision) or `month` (month and year). */
  dateType?: 'date' | 'month';
};

// Add / edit education modal. The design is fixed here; data, validation and saving come from the caller.
export default function EducationFormModal({
  open,
  onOpenChange,
  title,
  submitLabel,
  schema,
  defaultValues = EMPTY_EDUCATION_FORM,
  onSubmit,
  countryField,
  dateType = 'date',
}: EducationFormModalProps) {
  const t = useTranslations('candidatePage');
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({
    resolver: typedZodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [defaultValues, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={setPortalContainer} className="max-w-175">
        <form
          noValidate
          onSubmit={(event) => {
            // Keep the submit inside the modal (React events bubble to any parent form).
            event.stopPropagation();
            void handleSubmit(onSubmit)(event);
          }}
          className="flex flex-col gap-5"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl text-black sm:text-[28px]">
              {title}
            </DialogTitle>
          </DialogHeader>

          <InputField
            id="education-degree"
            label={t('profile.degree')}
            type="text"
            placeholder={t('profile.degree-placeholder')}
            {...register('degree')}
            error={errors.degree?.message}
          />

          <InputField
            id="education-university"
            label={t('profile.university')}
            type="text"
            placeholder={t('profile.university-placeholder')}
            {...register('university')}
            error={errors.university?.message}
          />

          <InputField
            id="education-gpa"
            label={t('profile.gpa')}
            type="text"
            inputMode="decimal"
            placeholder={t('profile.gpa-placeholder')}
            {...register('gpa')}
            error={errors.gpa?.message}
          />

          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="education-country"
                label={t('profile.country')}
                placeholder={
                  countryField.isLoading
                    ? t('profile.loading-countries')
                    : t('profile.country-placeholder')
                }
                options={countryField.options}
                value={field.value}
                onChange={field.onChange}
                disabled={countryField.isLoading}
                portalContainer={portalContainer}
                withSearchInput
                searchPlaceholder={t('profile.search-countries')}
                onSearchChange={countryField.onSearchChange}
                onReachEnd={countryField.onReachEnd}
                hasNextPage={countryField.hasNextPage}
                isFetchingNextPage={countryField.isFetchingNextPage}
                error={errors.country?.message}
              />
            )}
          />

          <div className="flex items-center justify-between gap-2 max-md:flex-col">
            <InputField
              id="education-start-date"
              label={t('profile.start-date')}
              type={dateType}
              {...register('startDate')}
              error={errors.startDate?.message}
            />

            <InputField
              id="education-end-date"
              label={t('profile.end-date')}
              type={dateType}
              {...register('endDate')}
              error={errors.endDate?.message}
            />
          </div>

          <DialogFooter className="flex items-center justify-center!">
            <Button
              className="w-1/3"
              size="pill"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.saving') : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
