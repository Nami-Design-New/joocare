'use client';

import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  useCertificationLookup,
  useCountryLookup,
  useEducationLevelLookup,
  useExperienceLookup,
  usePrimaryLicenseLookup,
  useLicenseStatusLookup,
  useSeniorityLookup,
  useVerificationStatusLookup,
} from '../../hooks/useLookupOptions';
import type { AdditionalInfoValues } from '../../types/additional-info.types';
import LookupSelectField from '../fields/LookupSelectField';
import MultiSelectWithOtherField from '../fields/MultiSelectWithOtherField';
import InfoSection from '../InfoSection';
import InfoSubsection from '../InfoSubsection';

const GRID = 'grid grid-cols-1 items-start gap-5 md:grid-cols-2';

export default function QualificationsSection() {
  const t = useTranslations('candidatePage.additional-info');
  const { control, setValue } = useFormContext<AdditionalInfoValues>();
  const hasLicense = Boolean(
    useWatch({ control, name: 'professionalLicense' }),
  );

  // License country and statuses belong to the selected license.
  const clearLicenseDetails = (license: string) => {
    if (license) return;
    setValue('professionalLicenseCountries', [], { shouldDirty: true });
    setValue('otherLicenseCountry', '', { shouldDirty: true });
    setValue('licenseStatus', '', { shouldDirty: true });
    setValue('verificationStatus', '', { shouldDirty: true });
  };
  const licenseDetailPlaceholder = (placeholder: string) =>
    hasLicense ? placeholder : t('placeholders.select-license-first');

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
            useLookup={usePrimaryLicenseLookup}
            onValueChange={clearLicenseDetails}
          />
          <MultiSelectWithOtherField
            name="professionalLicenseCountries"
            otherName="otherLicenseCountry"
            label={t('fields.license-country')}
            placeholder={licenseDetailPlaceholder(
              t('placeholders.select-country'),
            )}
            otherPlaceholder={t('placeholders.other-license-country')}
            useLookup={useCountryLookup}
            disabled={!hasLicense}
          />
          <LookupSelectField
            name="licenseStatus"
            label={t('fields.license-status')}
            placeholder={licenseDetailPlaceholder(
              t('placeholders.select-status'),
            )}
            useLookup={useLicenseStatusLookup}
            searchable={false}
            disabled={!hasLicense}
          />
          <LookupSelectField
            name="verificationStatus"
            label={t('fields.verification-status')}
            placeholder={licenseDetailPlaceholder(
              t('placeholders.select-status'),
            )}
            useLookup={useVerificationStatusLookup}
            searchable={false}
            disabled={!hasLicense}
          />
        </div>
      </InfoSubsection>
    </InfoSection>
  );
}
