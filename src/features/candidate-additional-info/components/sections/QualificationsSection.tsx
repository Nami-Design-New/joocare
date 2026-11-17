'use client';

import { useTranslations } from 'next-intl';
import {
  useCertificationLookup,
  useCountryLookup,
  useEducationLevelLookup,
  useExperienceLookup,
  useLicenseLookup,
  useLicenseStatusLookup,
  useSeniorityLookup,
  useVerificationStatusLookup,
} from '../../hooks/useLookupOptions';
import LookupSelectField from '../fields/LookupSelectField';
import MultiSelectWithOtherField from '../fields/MultiSelectWithOtherField';
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
          <MultiSelectWithOtherField
            name="certifications"
            otherName="otherCertification"
            label={t('fields.certifications')}
            placeholder={t('placeholders.add-certifications')}
            otherPlaceholder={t('placeholders.other-certification')}
            useLookup={useCertificationLookup}
          />
          <LookupSelectField
            name="professionalLicense"
            label={t('fields.professional-license')}
            placeholder={t('placeholders.select-license')}
            useLookup={useLicenseLookup}
          />
          <MultiSelectWithOtherField
            name="professionalLicenseCountries"
            otherName="otherLicenseCountry"
            label={t('fields.license-country')}
            placeholder={t('placeholders.select-country')}
            otherPlaceholder={t('placeholders.other-license-country')}
            useLookup={useCountryLookup}
          />
          <LookupSelectField
            name="licenseStatus"
            label={t('fields.license-status')}
            placeholder={t('placeholders.select-status')}
            useLookup={useLicenseStatusLookup}
            searchable={false}
          />
          <LookupSelectField
            name="verificationStatus"
            label={t('fields.verification-status')}
            placeholder={t('placeholders.select-status')}
            useLookup={useVerificationStatusLookup}
            searchable={false}
          />
        </div>
      </InfoSubsection>
    </InfoSection>
  );
}
