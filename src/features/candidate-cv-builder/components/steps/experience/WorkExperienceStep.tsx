'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import ExperienceFormModal from '@/shared/components/modals/ExperienceFormModal';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  JOB_TITLE_OPTIONS,
  OTHER_JOB_TITLE,
} from '../../../constants/cv-builder-options';
import { FRESH_GRADUATE_PROFILE } from '../../../constants/cv-builder-preview-data';
import type { CvBuilderValues } from '../../../types/cv-builder.types';
import { emptyExperience } from '../../../utils/cv-builder-defaults';
import { createCvExperienceModalSchema } from '../../../validation/cv-builder-schema';
import CvSwitchCard from '../../fields/CvSwitchCard';
import { FieldSurfaceProvider } from '../../fields/field-surface';
import CvTextareaField from '../../fields/CvTextareaField';
import CvAddButton from '../../wizard/CvAddButton';
import CvRepeatableList from '../../wizard/CvRepeatableList';
import CvStepCard from '../../wizard/CvStepCard';
import ExperienceItemFields from './ExperienceItemFields';

type CvExperience = CvBuilderValues['experience']['items'][number];

// Shared Experience modal with the CV builder logic: fixed lists, month dates, added to the wizard form.
function CvExperienceModal({
  title,
  onAdd,
  onClose,
}: {
  title: string;
  onAdd: (item: CvExperience) => void;
  onClose: () => void;
}) {
  const tWizard = useTranslations('candidatePage.buildCv.wizard');
  const tErrors = useTranslations('candidatePage.buildCv.errors');
  const schema = useMemo(
    () => createCvExperienceModalSchema({ required: tErrors('required') }),
    [tErrors],
  );

  return (
    <ExperienceFormModal
      open
      onOpenChange={(open) => !open && onClose()}
      title={title}
      submitLabel={tWizard('add')}
      schema={schema}
      dateType="month"
      otherJobTitleValue={OTHER_JOB_TITLE}
      jobTitleField={{ options: JOB_TITLE_OPTIONS }}
      employmentTypeField={{ options: EMPLOYMENT_TYPE_OPTIONS }}
      onSubmit={(values) => {
        onAdd(values);
        onClose();
      }}
    />
  );
}

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
          renderAddModal={({ onAdd, onClose }) => (
            <CvExperienceModal
              title={t('add-title')}
              onAdd={onAdd}
              onClose={onClose}
            />
          )}
        />
      )}
    </CvStepCard>
  );
}
