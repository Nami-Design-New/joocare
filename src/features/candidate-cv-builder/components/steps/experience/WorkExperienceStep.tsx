'use client';

import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import { FRESH_GRADUATE_PROFILE } from '../../../constants/cv-builder-preview-data';
import type { CvBuilderValues } from '../../../types/cv-builder.types';
import { emptyExperience } from '../../../utils/cv-builder-defaults';
import CvSwitchCard from '../../fields/CvSwitchCard';
import { FieldSurfaceProvider } from '../../fields/field-surface';
import CvTextareaField from '../../fields/CvTextareaField';
import CvAddButton from '../../wizard/CvAddButton';
import CvRepeatableList from '../../wizard/CvRepeatableList';
import CvStepCard from '../../wizard/CvStepCard';
import ExperienceItemFields from './ExperienceItemFields';

// Step 7: work experience, or an editable profile + strengths text for fresh graduates.
export default function WorkExperienceStep() {
  const t = useTranslations('candidatePage.buildCv.experience');
  const { getValues, setValue } = useFormContext<CvBuilderValues>();
  const freshGraduate = useWatch<CvBuilderValues, 'experience.freshGraduate'>({
    name: 'experience.freshGraduate',
  });

  return (
    <CvStepCard title={t('title')} description={t('description')}>
      <CvSwitchCard
        name="experience.freshGraduate"
        title={t('fresh-graduate')}
        description={t('fresh-graduate-description')}
        onCheckedChange={(checked) => {
          // Prefill the suggested profile the first time (it stays editable).
          if (checked && !getValues('experience.profile')) {
            setValue('experience.profile', FRESH_GRADUATE_PROFILE);
          }
        }}
      >
        {freshGraduate && (
          <FieldSurfaceProvider surface="card">
            <CvTextareaField
              name="experience.profile"
              aria-label={t('profile-label')}
              className="min-h-90"
            />
          </FieldSurfaceProvider>
        )}
      </CvSwitchCard>

      {!freshGraduate && (
        <CvRepeatableList
          name="experience.items"
          getTitle={(number) => t('item', { number })}
          addTitle={t('add-title')}
          createItem={emptyExperience}
          renderFields={(index) => <ExperienceItemFields index={index} />}
          renderAdd={(add) => (
            <CvAddButton variant="pill" label={t('add')} onClick={add} />
          )}
        />
      )}
    </CvStepCard>
  );
}
