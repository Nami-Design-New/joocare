'use client';

import { useTranslations } from 'next-intl';
import { LICENSE_STATUSES, VERIFICATION_STATUSES } from '../../constants';
import {
  useCertificationLookup,
  useCountryLookup,
  useEducationLevelLookup,
  useExperienceLookup,
  useLicenseLookup,
  useSeniorityLookup,
} from '../../hooks/useLookupOptions';
import LookupMultiSelectField from '../fields/LookupMultiSelectField';
import LookupSelectField from '../fields/LookupSelectField';
import OptionsSelectField from '../fields/OptionsSelectField';
import InfoSection from '../InfoSection';
import InfoSubsection from '../InfoSubsection';

const GRID = 'grid grid-cols-1 items-start gap-5 md:grid-cols-2';

export default function QualificationsSection() {
  const t = useTranslations('candidatePage.additional-info');

  return (
    <InfoSection section="qualifications">
      <InfoSubsection title={t('qualifications.experience')}>
        <div className={GRID}>
          <LookupSelectField
            name="yearsInRole"
            label={t('fields.years-in-role')}
            placeholder={t('placeholders.select-years')}
            useLookup={useExperienceLookup}
          />
          <LookupSelectField
            name="seniorityLevel"
            label={t('fields.seniority-level')}
            placeholder={t('placeholders.select-seniority')}
            useLookup={useSeniorityLookup}
          />
        </div>
      </InfoSubsection>
      <InfoSubsection title={t('qualifications.licensing')}>
        <div className={GRID}>
          <LookupSelectField
            name="educationLevel"
            label={t('fields.education-level')}
            placeholder={t('placeholders.select-education')}
            useLookup={useEducationLevelLookup}
          />
          <LookupMultiSelectField
            name="certifications"
            label={t('fields.certifications')}
            placeholder={t('placeholders.add-certifications')}
            useLookup={useCertificationLookup}
          />
          <LookupSelectField
            name="professionalLicense"
            label={t('fields.professional-license')}
            placeholder={t('placeholders.select-license')}
            useLookup={useLicenseLookup}
          />
          <LookupSelectField
            name="licenseCountry"
            label={t('fields.license-country')}
            placeholder={t('placeholders.select-country')}
            useLookup={useCountryLookup}
          />
          <OptionsSelectField
            name="licenseStatus"
            label={t('fields.license-status')}
            placeholder={t('placeholders.select-status')}
            options={LICENSE_STATUSES}
          />
          <OptionsSelectField
            name="verificationStatus"
            label={t('fields.verification-status')}
            placeholder={t('placeholders.select-status')}
            options={VERIFICATION_STATUSES}
          />
        </div>
      </InfoSubsection>
    </InfoSection>
  );
}
