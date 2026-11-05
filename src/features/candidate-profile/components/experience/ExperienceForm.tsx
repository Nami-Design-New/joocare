'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { InputField } from '@/shared/components/InputField';
import LabelCheckbox from '@/shared/components/LabelCheckbox';
import { Button } from '@/shared/components/ui/button';
import { DialogFooter } from '@/shared/components/ui/dialog';
import { useExperienceForm } from '../../hooks/useExperienceForm';
import type { CandidateExperienceViewModel } from '../../types/profile.types';
import ExperienceEmploymentTypeField from './ExperienceEmploymentTypeField';
import ExperienceJobTitleField from './ExperienceJobTitleField';
import ExperienceLocationFields from './ExperienceLocationFields';
import ExperienceResponsibilitiesField from './ExperienceResponsibilitiesField';

type ExperienceFormProps = {
  experience?: CandidateExperienceViewModel | null;
  portalContainer: HTMLElement | null;
  onSaved: () => void;
};

export default function ExperienceForm({
  experience,
  portalContainer,
  onSaved,
}: ExperienceFormProps) {
  const t = useTranslations();
  const { form, onSubmit, isSaving, clearEndDateWhenCurrent } =
    useExperienceForm({ experience, onSaved });
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form;
  const workHere = watch('workHere');
  const submitLabel = experience?.id
    ? t('common.save')
    : t('candidatePage.common.add');

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <ExperienceJobTitleField
        control={control}
        portalContainer={portalContainer}
        initialTitle={experience?.title}
      />

      <InputField
        id="organizationOrHospitalName"
        label={t('candidatePage.profile.organization-name')}
        placeholder={t('candidatePage.profile.organization-placeholder')}
        {...register('organizationOrHospitalName')}
        error={errors.organizationOrHospitalName?.message}
      />

      <ExperienceEmploymentTypeField
        control={control}
        portalContainer={portalContainer}
      />

      <ExperienceLocationFields
        control={control}
        portalContainer={portalContainer}
      />

      <div className="flex gap-2 max-md:flex-col">
        <InputField
          id="startDate"
          label={t('candidatePage.profile.start-date')}
          type="date"
          {...register('startDate')}
          error={errors.startDate?.message}
        />

        <InputField
          id="endDate"
          label={t('candidatePage.profile.end-date')}
          type="date"
          disabled={workHere}
          {...register('endDate')}
          error={errors.endDate?.message}
        />
      </div>

      <Controller
        name="workHere"
        control={control}
        render={({ field }) => (
          <LabelCheckbox
            id="workHere"
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              clearEndDateWhenCurrent(checked);
            }}
            error={errors.workHere?.message}
          >
            {t('candidatePage.profile.currently-work-here')}
          </LabelCheckbox>
        )}
      />

      <ExperienceResponsibilitiesField control={control} register={register} />

      <DialogFooter className="flex items-center justify-center!">
        <Button
          className="hover:bg-primary/70 w-1/3"
          size="pill"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? t('candidatePage.common.saving') : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
