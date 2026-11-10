'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import ExperienceFormModal, {
  type ExperienceFormValues,
} from '@/shared/components/modals/ExperienceFormModal';
import useGetEmploymentTypes from '@/shared/hooks/useGetEmploymentTypes';
import useGetJobTitles from '@/shared/hooks/useGetJobTitles';
import { OTHER_JOB_TITLE_VALUE } from '../../constants/experience';
import { useSaveExperience } from '../../hooks/useSaveExperience';
import type { CandidateExperienceViewModel } from '../../types/profile.types';
import { toExperienceFormState } from '../../utils/experience-form';
import { toLookupOptions } from '../../utils/lookup-options';
import { createExperienceModalSchema } from '../../validation/experience-modal-schema';

type ExperienceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  experience?: CandidateExperienceViewModel | null;
};

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : undefined;

// Mounted only while open, so the job title / employment type lookups load on demand.
export function ExperienceModal(props: ExperienceModalProps) {
  return props.open ? <ProfileExperienceModal {...props} /> : null;
}

// Profile experience modal: shared design, job titles / employment types from the API, saved to the API.
function ProfileExperienceModal({
  open,
  onOpenChange,
  label,
  experience,
}: ExperienceModalProps) {
  const t = useTranslations();
  const [jobTitleSearch, setJobTitleSearch] = useState('');
  const [employmentTypeSearch, setEmploymentTypeSearch] = useState('');
  const schema = useMemo(
    () =>
      createExperienceModalSchema({
        jobTitleRequired: t('authPage.validation.job-title-required'),
        organizationMin: t('candidateValidation.organization-min'),
        organizationMax: t('candidateValidation.organization-max'),
        startDateRequired: t('candidateValidation.start-date-required'),
        responsibilityMin: t('candidateValidation.responsibility-min'),
        responsibilityMax: t('candidateValidation.responsibility-max'),
        responsibilitiesMin: t('candidateValidation.responsibilities-min'),
        otherJobTitleRequired: t(
          'authPage.validation.other-job-title-required',
        ),
        startDatePast: t('candidateValidation.start-date-past'),
        endDateRequired: t('candidateValidation.end-date-required'),
        endDateAfterStart: t('candidateValidation.end-date-after-start'),
      }),
    [t],
  );
  const defaultValues = useMemo(
    () => toExperienceFormState(experience),
    [experience],
  );
  const jobTitles = useGetJobTitles(jobTitleSearch);
  const employmentTypes = useGetEmploymentTypes(employmentTypeSearch);
  const jobTitleOptions = useMemo(
    () => [
      { label: t('authPage.common.other'), value: OTHER_JOB_TITLE_VALUE },
      ...toLookupOptions(jobTitles.jobTitles),
    ],
    [jobTitles.jobTitles, t],
  );
  const employmentTypeOptions = useMemo(
    () => toLookupOptions(employmentTypes.employmentTypes),
    [employmentTypes.employmentTypes],
  );
  const { mutateAsync: saveExperience } = useSaveExperience(experience);

  const handleSubmit = async (values: ExperienceFormValues) => {
    try {
      await saveExperience(values);
      onOpenChange(false);
    } catch {
      // The mutation already shows the error toast; keep the modal open.
    }
  };

  return (
    <ExperienceFormModal
      open={open}
      onOpenChange={onOpenChange}
      title={label}
      submitLabel={
        experience?.id ? t('common.save') : t('candidatePage.common.add')
      }
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      otherJobTitleValue={OTHER_JOB_TITLE_VALUE}
      jobTitleField={{
        options: jobTitleOptions,
        isLoading: jobTitles.isLoading,
        error: errorMessage(jobTitles.error),
        onSearchChange: setJobTitleSearch,
        onReachEnd: () => void jobTitles.fetchNextPage(),
        hasNextPage: jobTitles.hasNextPage,
        isFetchingNextPage: jobTitles.isFetchingNextPage,
      }}
      employmentTypeField={{
        options: employmentTypeOptions,
        isLoading: employmentTypes.isLoading,
        error: errorMessage(employmentTypes.error),
        onSearchChange: setEmploymentTypeSearch,
        onReachEnd: () => void employmentTypes.fetchNextPage(),
        hasNextPage: employmentTypes.hasNextPage,
        isFetchingNextPage: employmentTypes.isFetchingNextPage,
      }}
    />
  );
}
