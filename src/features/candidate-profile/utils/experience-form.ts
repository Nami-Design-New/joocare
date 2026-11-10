import {
  EMPTY_EXPERIENCE_FORM,
  type ExperienceFormValues,
} from '@/shared/components/modals/ExperienceFormModal';
import { OTHER_JOB_TITLE_VALUE } from '../constants/experience';
import type {
  CandidateExperienceViewModel,
  ExperiencePayload,
} from '../types/profile.types';

type PayloadContext = Pick<
  ExperiencePayload,
  'locale' | 'token' | 'countryId' | 'cityId'
>;

// The saved title is free text; the modal switches it to the matching job title option once loaded.
export function toExperienceFormState(
  experience?: CandidateExperienceViewModel | null,
): ExperienceFormValues {
  if (!experience) {
    return EMPTY_EXPERIENCE_FORM;
  }

  return {
    jobTitle: OTHER_JOB_TITLE_VALUE,
    otherJobTitle: experience.title,
    organization: experience.organization ?? '',
    employmentType: experience.employmentTypeId ?? '',
    startDate: experience.startDate ?? '',
    endDate: experience.endDate ?? '',
    currentlyWorking: experience.isCurrent,
    responsibilities:
      experience.bullets.length > 0
        ? experience.bullets.map((bullet) => ({ value: bullet }))
        : [{ value: '' }],
  };
}

export function toExperiencePayload(
  form: ExperienceFormValues,
  context: PayloadContext,
): ExperiencePayload {
  const isOtherJobTitle = form.jobTitle === OTHER_JOB_TITLE_VALUE;

  return {
    title: isOtherJobTitle ? form.otherJobTitle.trim() : undefined,
    jobTitleId: isOtherJobTitle ? undefined : form.jobTitle,
    company: form.organization.trim(),
    employmentTypeId: form.employmentType || undefined,
    startDate: form.startDate,
    endDate: form.currentlyWorking ? undefined : form.endDate.trim(),
    isCurrent: form.currentlyWorking,
    responsibilities: form.responsibilities.map((item) => item.value.trim()),
    ...context,
  };
}
