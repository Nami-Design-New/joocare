'use client';

import { useTranslations } from 'next-intl';
import { emptyCertificate } from '../../utils/cv-builder-defaults';
import CvTextField from '../fields/CvTextField';
import CvAddButton from '../wizard/CvAddButton';
import CvRepeatableList from '../wizard/CvRepeatableList';
import CvStepCard from '../wizard/CvStepCard';

// Step 6: repeatable certificates.
export default function CertificatesStep() {
  const t = useTranslations('candidatePage.buildCv');

  return (
    <CvStepCard
      title={t('certificates.title')}
      description={t('certificates.description')}
    >
      <CvRepeatableList
        name="certificates"
        getTitle={(number) => t('certificates.item', { number })}
        addTitle={t('certificates.add-title')}
        createItem={emptyCertificate}
        renderAdd={(add) => (
          <CvAddButton
            variant="round"
            label={t('certificates.add')}
            onClick={add}
          />
        )}
        renderFields={(index) => (
          <>
            <CvTextField
              name={`certificates.${index}.name`}
              label={t('certificates.name')}
              placeholder={t('certificates.name-placeholder')}
            />
            <CvTextField
              name={`certificates.${index}.organization`}
              label={t('certificates.organization')}
              placeholder={t('certificates.organization-placeholder')}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <CvTextField
                name={`certificates.${index}.startDate`}
                type="month"
                label={t('certificates.start-date')}
              />
              <CvTextField
                name={`certificates.${index}.endDate`}
                type="month"
                label={t('certificates.end-date')}
              />
            </div>
          </>
        )}
      />
    </CvStepCard>
  );
}
