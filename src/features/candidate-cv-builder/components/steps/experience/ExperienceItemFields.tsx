'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import LabelCheckbox from '@/shared/components/LabelCheckbox';
import type { ExperienceSelectField } from '@/shared/components/modals/ExperienceFormModal';
import { OTHER_JOB_TITLE } from '../../../constants/cv-builder-options';
import type { CvBuilderValues } from '../../../types/cv-builder.types';
import CvSelectField from '../../fields/CvSelectField';
import CvTextField from '../../fields/CvTextField';
import { useFieldId } from '../../fields/field-surface';
import ResponsibilitiesField from './ResponsibilitiesField';

type ExperienceItemFieldsProps = {
  index: number;
  jobTitleField: ExperienceSelectField;
  employmentTypeField: ExperienceSelectField;
};

// Fields of one work-experience card. "Other" job title asks for the title.
export default function ExperienceItemFields({
  index,
  jobTitleField,
  employmentTypeField,
}: ExperienceItemFieldsProps) {
  const t = useTranslations('candidatePage.buildCv.experience');
  const { setValue } = useFormContext<CvBuilderValues>();
  const path = `experience.items.${index}` as const;
  const currentlyWorkingId = useFieldId(`${path}.currentlyWorking`);
  const [jobTitle, currentlyWorking] = useWatch<
    CvBuilderValues,
    [`${typeof path}.jobTitle`, `${typeof path}.currentlyWorking`]
  >({ name: [`${path}.jobTitle`, `${path}.currentlyWorking`] });

  return (
    <>
      <CvSelectField
        name={`${path}.jobTitle`}
        label={t('job-title')}
        placeholder={t('job-title-placeholder')}
        options={jobTitleField.options}
        disabled={jobTitleField.isLoading}
        withSearchInput
        onSearchChange={jobTitleField.onSearchChange}
        clearable
        onReachEnd={jobTitleField.onReachEnd}
        hasNextPage={jobTitleField.hasNextPage}
        isFetchingNextPage={jobTitleField.isFetchingNextPage}
      />
      {jobTitle === OTHER_JOB_TITLE && (
        <CvTextField
          name={`${path}.otherJobTitle`}
          label={t('other-job-title')}
          placeholder={t('other-job-title-placeholder')}
        />
      )}
      <CvTextField
        name={`${path}.organization`}
        label={t('organization')}
        placeholder={t('organization-placeholder')}
      />
      <CvSelectField
        name={`${path}.employmentType`}
        label={t('employment-type')}
        placeholder={t('employment-type-placeholder')}
        options={employmentTypeField.options}
        disabled={employmentTypeField.isLoading}
        withSearchInput
        onSearchChange={employmentTypeField.onSearchChange}
        clearable
        onReachEnd={employmentTypeField.onReachEnd}
        hasNextPage={employmentTypeField.hasNextPage}
        isFetchingNextPage={employmentTypeField.isFetchingNextPage}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <CvTextField
          name={`${path}.startDate`}
          type="month"
          label={t('start-date')}
        />
        <div className="flex flex-col gap-3">
          <CvTextField
            name={`${path}.endDate`}
            type="month"
            label={t('end-date')}
            disabled={currentlyWorking}
          />
          <Controller<CvBuilderValues, `${typeof path}.currentlyWorking`>
            name={`${path}.currentlyWorking`}
            render={({ field }) => (
              <LabelCheckbox
                id={currentlyWorkingId}
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) setValue(`${path}.endDate`, '');
                }}
                className="text-sm text-muted-foreground"
              >
                {t('currently-working')}
              </LabelCheckbox>
            )}
          />
        </div>
      </div>
      <ResponsibilitiesField experienceIndex={index} />
    </>
  );
}
