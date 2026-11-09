'use client';

import { useTranslations } from 'next-intl';
import { COUNTRY_OPTIONS } from '../../constants/cv-builder-options';
import { emptyEducation } from '../../utils/cv-builder-defaults';
import CvSelectField from '../fields/CvSelectField';
import CvTextField from '../fields/CvTextField';
import CvAddButton from '../wizard/CvAddButton';
import CvRepeatableList from '../wizard/CvRepeatableList';
import CvStepCard from '../wizard/CvStepCard';

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
