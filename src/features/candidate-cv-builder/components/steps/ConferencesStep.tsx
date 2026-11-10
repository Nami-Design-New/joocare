'use client';

import { useTranslations } from 'next-intl';
import { CONFERENCE_LOCATION_OPTIONS } from '../../constants/cv-builder-options';
import { emptyConference } from '../../utils/cv-builder-defaults';
import CvSelectField from '../fields/CvSelectField';
import CvTextField from '../fields/CvTextField';
import CvStepCard from '../wizard/CvStepCard';
import CvSwitchEntries from '../wizard/CvSwitchEntries';

// Step 10: CPD programs and conferences attended (optional).
export default function ConferencesStep() {
  const t = useTranslations('candidatePage.buildCv.conferences');

  return (
    <CvStepCard title={t('title')} description={t('description')}>
      <CvSwitchEntries
        section="conferences"
        title={t('toggle')}
        description={t('toggle-description')}
        addLabel={t('add')}
        removeLabel={t('remove')}
        createItem={emptyConference}
        renderFields={(index) => (
          <>
            <CvTextField
              name={`conferences.items.${index}.name`}
              label={t('name')}
              placeholder={t('name-placeholder')}
            />
            <CvSelectField
              name={`conferences.items.${index}.location`}
              label={t('location')}
              placeholder={t('location-placeholder')}
              options={CONFERENCE_LOCATION_OPTIONS}
            />
            <CvTextField
              name={`conferences.items.${index}.date`}
              type="date"
              label={t('date')}
              className="bg-muted"
            />
          </>
        )}
      />
    </CvStepCard>
  );
}
