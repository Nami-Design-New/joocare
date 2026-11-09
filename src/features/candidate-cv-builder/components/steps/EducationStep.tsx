'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import EducationFormModal from '@/shared/components/modals/EducationFormModal';
import { COUNTRY_OPTIONS } from '../../constants/cv-builder-options';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import { emptyEducation } from '../../utils/cv-builder-defaults';
import { createCvEducationSchema } from '../../validation/cv-builder-schema';
import CvSelectField from '../fields/CvSelectField';
import CvTextField from '../fields/CvTextField';
import CvAddButton from '../wizard/CvAddButton';
import CvRepeatableList from '../wizard/CvRepeatableList';
import CvStepCard from '../wizard/CvStepCard';

type CvEducation = CvBuilderValues['educations'][number];

// Shared Education modal with the CV builder logic: fixed country list, month dates, added to the wizard form.
function CvEducationModal({
  title,
  onAdd,
  onClose,
}: {
  title: string;
  onAdd: (item: CvEducation) => void;
  onClose: () => void;
}) {
  const tWizard = useTranslations('candidatePage.buildCv.wizard');
  const tErrors = useTranslations('candidatePage.buildCv.errors');
  const schema = useMemo(
    () =>
      createCvEducationSchema({
        required: tErrors('required'),
        invalidGpa: tErrors('invalid-gpa'),
      }),
    [tErrors],
  );

  return (
    <EducationFormModal
      open
      onOpenChange={(open) => !open && onClose()}
      title={title}
      submitLabel={tWizard('add')}
      schema={schema}
      dateType="month"
      countryField={{ options: COUNTRY_OPTIONS }}
      onSubmit={(values) => {
        onAdd(values);
        onClose();
      }}
    />
  );
}

// Step 5: repeatable education entries.
export default function EducationStep() {
  const t = useTranslations('candidatePage.buildCv.education');

  return (
    <CvStepCard title={t('title')} description={t('description')}>
      <CvRepeatableList
        name="educations"
        getTitle={(number) => t('item', { number })}
        addTitle={t('add-title')}
        createItem={emptyEducation}
        renderAdd={(add) => (
          <CvAddButton variant="round" label={t('add')} onClick={add} />
        )}
        renderAddModal={({ onAdd, onClose }) => (
          <CvEducationModal
            title={t('add-title')}
            onAdd={onAdd}
            onClose={onClose}
          />
        )}
        renderFields={(index) => (
          <>
            <CvTextField
              name={`educations.${index}.degree`}
              label={t('degree')}
              placeholder={t('degree-placeholder')}
            />
            <CvTextField
              name={`educations.${index}.university`}
              label={t('university')}
              placeholder={t('university-placeholder')}
            />
            <CvTextField
              name={`educations.${index}.gpa`}
              label={t('gpa')}
              placeholder={t('gpa-placeholder')}
              inputMode="decimal"
            />
            <CvSelectField
              name={`educations.${index}.country`}
              label={t('country')}
              placeholder={t('country-placeholder')}
              options={COUNTRY_OPTIONS}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <CvTextField
                name={`educations.${index}.startDate`}
                type="month"
                label={t('start-date')}
              />
              <CvTextField
                name={`educations.${index}.endDate`}
                type="month"
                label={t('end-date')}
              />
            </div>
          </>
        )}
      />
    </CvStepCard>
  );
}
