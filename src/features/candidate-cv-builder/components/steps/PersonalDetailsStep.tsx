'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFieldArray } from 'react-hook-form';
import {
  LANGUAGE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  NATIONALITY_OPTIONS,
  PROFICIENCY_OPTIONS,
} from '../../constants/cv-builder-options';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import { emptyLanguage } from '../../utils/cv-builder-defaults';
import CvPhotoField from '../fields/CvPhotoField';
import CvSelectField from '../fields/CvSelectField';
import CvTextField from '../fields/CvTextField';
import CvAddButton from '../wizard/CvAddButton';
import CvStepCard from '../wizard/CvStepCard';

// Step 1: photo, name, nationality, birth year, marital status, location and languages.
export default function PersonalDetailsStep() {
  const t = useTranslations('candidatePage.buildCv');
  const languages = useFieldArray<CvBuilderValues, 'personal.languages'>({
    name: 'personal.languages',
  });

  return (
    <div className="flex flex-col gap-8 sm:gap-15">
      <CvStepCard
        title={t('personal.title')}
        description={t('personal.description')}
      >
        <CvPhotoField />
        <CvTextField
          name="personal.fullName"
          label={t('personal.full-name')}
          placeholder={t('personal.full-name-placeholder')}
          autoComplete="name"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <CvSelectField
            name="personal.nationality"
            label={t('personal.nationality')}
            placeholder={t('common.choose')}
            options={NATIONALITY_OPTIONS}
          />
          <CvTextField
            name="personal.yearOfBirth"
            type="date"
            label={t('personal.year-of-birth')}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <CvSelectField
            name="personal.maritalStatus"
            label={t('personal.marital-status')}
            hint={t('common.optional')}
            placeholder={t('common.choose')}
            options={MARITAL_STATUS_OPTIONS}
          />
          <CvTextField
            name="personal.country"
            label={t('personal.country')}
            placeholder={t('personal.country-placeholder')}
          />
          <CvTextField
            name="personal.city"
            label={t('personal.city')}
            placeholder={t('personal.city-placeholder')}
          />
        </div>
      </CvStepCard>

      <CvStepCard
        title={t('languages.title')}
        description={t('languages.description')}
      >
        {languages.fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-3">
            <div className="grid grow gap-4 sm:grid-cols-2">
              <CvSelectField
                name={`personal.languages.${index}.language`}
                label={t('languages.language')}
                placeholder={t('common.choose')}
                options={LANGUAGE_OPTIONS}
              />
              <CvSelectField
                name={`personal.languages.${index}.proficiency`}
                label={t('languages.proficiency')}
                placeholder={t('common.choose')}
                options={PROFICIENCY_OPTIONS}
              />
            </div>
            {languages.fields.length > 1 && (
              <button
                type="button"
                onClick={() => languages.remove(index)}
                aria-label={t('languages.remove')}
                className="flex size-13 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-destructive"
              >
                <X aria-hidden className="size-5" />
              </button>
            )}
          </div>
        ))}
        <CvAddButton
          variant="dashed"
          label={t('languages.add')}
          onClick={() => languages.append(emptyLanguage())}
        />
      </CvStepCard>
    </div>
  );
}
