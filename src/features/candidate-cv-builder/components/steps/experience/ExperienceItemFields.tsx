'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import LabelCheckbox from '@/shared/components/LabelCheckbox';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  JOB_TITLE_OPTIONS,
  OTHER_JOB_TITLE,
} from '../../../constants/cv-builder-options';
import type { CvBuilderValues } from '../../../types/cv-builder.types';
import CvSelectField from '../../fields/CvSelectField';
import CvTextField from '../../fields/CvTextField';
import { useFieldId } from '../../fields/field-surface';
import ResponsibilitiesField from './ResponsibilitiesField';

type ExperienceItemFieldsProps = {
  index: number;
};

// Fields of one work-experience card. "Other" job title asks for the title.
export default function ExperienceItemFields({
  index,
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
        options={JOB_TITLE_OPTIONS}
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
        options={EMPLOYMENT_TYPE_OPTIONS}
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
                className="text-muted-foreground text-sm"
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
