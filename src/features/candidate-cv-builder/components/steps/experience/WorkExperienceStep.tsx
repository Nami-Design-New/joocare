'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import ExperienceFormModal, {
  type ExperienceSelectField,
} from '@/shared/components/modals/ExperienceFormModal';
import useGetEmploymentTypes from '@/shared/hooks/useGetEmploymentTypes';
import useGetJobTitles from '@/shared/hooks/useGetJobTitles';
import { OTHER_JOB_TITLE } from '../../../constants/cv-builder-options';
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
  jobTitleField,
  employmentTypeField,
}: {
  title: string;
  onAdd: (item: CvExperience) => void;
  onClose: () => void;
  jobTitleField: ExperienceSelectField;
  employmentTypeField: ExperienceSelectField;
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
      jobTitleField={jobTitleField}
      employmentTypeField={employmentTypeField}
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
  const tOptions = useTranslations('candidatePage.buildCv.options');
  const [jobTitleSearch, setJobTitleSearch] = useState('');
  const [employmentTypeSearch, setEmploymentTypeSearch] = useState('');
  const jobTitles = useGetJobTitles(jobTitleSearch);
  const employmentTypes = useGetEmploymentTypes(employmentTypeSearch);
  const { getValues, setValue } = useFormContext<CvBuilderValues>();
  const freshGraduate = useWatch<CvBuilderValues, 'experience.freshGraduate'>({
    name: 'experience.freshGraduate',
  });
  const jobTitleOptions = useMemo(
    () =>
      jobTitles.jobTitles
        .map((item) => ({
          label: String(item.title ?? item.name ?? ''),
          value: String(item.id ?? ''),
        }))
        .filter((item) => item.label && item.value),
    [jobTitles.jobTitles],
  );
  const employmentTypeOptions = useMemo(
    () =>
      employmentTypes.employmentTypes
        .map((item) => ({
          label: String(item.title ?? item.name ?? ''),
          value: String(item.id ?? ''),
        }))
        .filter((item) => item.label && item.value),
    [employmentTypes.employmentTypes],
  );
  const jobTitleField: ExperienceSelectField = {
    options: jobTitleOptions,
    isLoading: jobTitles.isLoading,
    onSearchChange: setJobTitleSearch,
    onReachEnd: () => void jobTitles.fetchNextPage(),
    hasNextPage: jobTitles.hasNextPage,
    isFetchingNextPage: jobTitles.isFetchingNextPage,
    clearOptionLabel: tOptions('clear-selection'),
  };
  const employmentTypeField: ExperienceSelectField = {
    options: employmentTypeOptions,
    isLoading: employmentTypes.isLoading,
    onSearchChange: setEmploymentTypeSearch,
    onReachEnd: () => void employmentTypes.fetchNextPage(),
    hasNextPage: employmentTypes.hasNextPage,
    isFetchingNextPage: employmentTypes.isFetchingNextPage,
    clearOptionLabel: tOptions('clear-selection'),
  };

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
          renderFields={(index) => (
            <ExperienceItemFields
              index={index}
              jobTitleField={jobTitleField}
              employmentTypeField={employmentTypeField}
            />
          )}
          renderAdd={(add) => (
            <CvAddButton variant="pill" label={t('add')} onClick={add} />
          )}
          renderAddModal={({ onAdd, onClose }) => (
            <CvExperienceModal
              title={t('add-title')}
              onAdd={onAdd}
              onClose={onClose}
              jobTitleField={jobTitleField}
              employmentTypeField={employmentTypeField}
            />
          )}
        />
      )}
    </CvStepCard>
  );
}
