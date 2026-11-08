'use client';

import { useTranslations } from 'next-intl';
import {
  JOB_TITLE_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
} from '../../constants/cv-builder-options';
import CvSelectField from '../fields/CvSelectField';
import CvSwitchCard from '../fields/CvSwitchCard';
import CvTextField from '../fields/CvTextField';
import CvStepCard from '../wizard/CvStepCard';

// Step 3: job title, experience, specialty and the license / availability switches.
export default function JobProfileStep() {
  const t = useTranslations('candidatePage.buildCv');

  return (
    <CvStepCard
      title={t('job-profile.title')}
      description={t('job-profile.description')}
    >
      <CvSelectField
        name="jobProfile.jobTitle"
        label={t('job-profile.job-title')}
        placeholder={t('job-profile.job-title-placeholder')}
        options={JOB_TITLE_OPTIONS}
      />
      <CvSelectField
        name="jobProfile.yearsOfExperience"
        label={t('job-profile.years')}
        placeholder={t('job-profile.years-placeholder')}
        options={YEARS_OF_EXPERIENCE_OPTIONS}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <CvTextField
          name="jobProfile.specialty"
          label={t('job-profile.specialty')}
          placeholder={t('job-profile.specialty-placeholder')}
        />
        <CvTextField
          name="jobProfile.subspecialty"
          label={t('job-profile.subspecialty')}
          hint={t('common.optional')}
          placeholder={t('job-profile.subspecialty-placeholder')}
        />
      </div>
      <CvSwitchCard
        name="jobProfile.hasLicense"
        title={t('job-profile.license')}
        description={t('job-profile.license-description')}
      />
      <CvSwitchCard
        name="jobProfile.availableNow"
        title={t('job-profile.available')}
        description={t('job-profile.available-description')}
      />
    </CvStepCard>
  );
}
