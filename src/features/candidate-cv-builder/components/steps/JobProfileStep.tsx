'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import useGetExperiences from '@/shared/hooks/useGetExperiences';
import useGetJobTitles from '@/shared/hooks/useGetJobTitles';
import useGetSpecialties from '@/shared/hooks/useGetSpecialties';
import CvSelectField from '../fields/CvSelectField';
import CvSwitchCard from '../fields/CvSwitchCard';
import CvTextField from '../fields/CvTextField';
import CvStepCard from '../wizard/CvStepCard';

// Step 3: job title, experience, specialty and the license / availability switches.
export default function JobProfileStep() {
  const t = useTranslations('candidatePage.buildCv');
  const [jobTitleSearch, setJobTitleSearch] = useState('');
  const [experienceSearch, setExperienceSearch] = useState('');
  const [specialtySearch, setSpecialtySearch] = useState('');
  const jobTitles = useGetJobTitles(jobTitleSearch);
  const experiences = useGetExperiences(experienceSearch);
  const specialties = useGetSpecialties(specialtySearch);
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
  const experienceOptions = useMemo(
    () =>
      experiences.experiences
        .map((item) => ({
          label: String(item.title ?? item.name ?? ''),
          value: String(item.id ?? ''),
        }))
        .filter((item) => item.label && item.value),
    [experiences.experiences],
  );
  const specialtyOptions = useMemo(
    () =>
      specialties.specialties
        .map((item) => ({
          label: String(item.title ?? item.name ?? ''),
          value: String(item.id ?? ''),
        }))
        .filter((item) => item.label && item.value),
    [specialties.specialties],
  );

  return (
    <CvStepCard
      title={t('job-profile.title')}
      description={t('job-profile.description')}
    >
      <CvSelectField
        name="jobProfile.jobTitle"
        label={t('job-profile.job-title')}
        placeholder={t('job-profile.job-title-placeholder')}
        options={jobTitleOptions}
        disabled={jobTitles.isLoading}
        withSearchInput
        onSearchChange={setJobTitleSearch}
        clearable
        onReachEnd={() => void jobTitles.fetchNextPage()}
        hasNextPage={jobTitles.hasNextPage}
        isFetchingNextPage={jobTitles.isFetchingNextPage}
      />
      <CvSelectField
        name="jobProfile.yearsOfExperience"
        label={t('job-profile.years')}
        placeholder={t('job-profile.years-placeholder')}
        options={experienceOptions}
        disabled={experiences.isLoading}
        withSearchInput
        onSearchChange={setExperienceSearch}
        clearable
        onReachEnd={() => void experiences.fetchNextPage()}
        hasNextPage={experiences.hasNextPage}
        isFetchingNextPage={experiences.isFetchingNextPage}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <CvSelectField
          name="jobProfile.specialty"
          label={t('job-profile.specialty')}
          placeholder={t('job-profile.specialty-placeholder')}
          options={specialtyOptions}
          disabled={specialties.isLoading}
          withSearchInput
          onSearchChange={setSpecialtySearch}
          clearable
          onReachEnd={() => void specialties.fetchNextPage()}
          hasNextPage={specialties.hasNextPage}
          isFetchingNextPage={specialties.isFetchingNextPage}
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
