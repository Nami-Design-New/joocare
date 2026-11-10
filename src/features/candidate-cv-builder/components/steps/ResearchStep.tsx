'use client';

import { useTranslations } from 'next-intl';
import {
  COUNTRY_OPTIONS,
  PUBLICATION_YEAR_OPTIONS,
} from '../../constants/cv-builder-options';
import { emptyPublication } from '../../utils/cv-builder-defaults';
import CvSelectField from '../fields/CvSelectField';
import CvTextField from '../fields/CvTextField';
import CvStepCard from '../wizard/CvStepCard';
import CvSwitchEntries from '../wizard/CvSwitchEntries';

// Step 9: research papers and publications (optional).
export default function ResearchStep() {
  const t = useTranslations('candidatePage.buildCv.research');

  return (
    <CvStepCard title={t('title')} description={t('description')}>
      <CvSwitchEntries
        section="research"
        title={t('toggle')}
        description={t('toggle-description')}
        addLabel={t('add')}
        removeLabel={t('remove')}
        createItem={emptyPublication}
        renderFields={(index) => (
          <>
            <CvTextField
              name={`research.items.${index}.title`}
              label={t('subject')}
              placeholder={t('subject-placeholder')}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <CvTextField
                name={`research.items.${index}.link`}
                type="url"
                label={t('link')}
                placeholder={t('link-placeholder')}
              />
              <CvSelectField
                name={`research.items.${index}.country`}
                label={t('country')}
                placeholder={t('country-placeholder')}
                options={COUNTRY_OPTIONS}
              />
            </div>
            <CvSelectField
              name={`research.items.${index}.year`}
              label={t('year')}
              placeholder={t('year-placeholder')}
              options={PUBLICATION_YEAR_OPTIONS}
            />
          </>
        )}
      />
    </CvStepCard>
  );
}
