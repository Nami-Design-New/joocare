import { OTHER_JOB_TITLE_VALUE } from '../constants/experience';
import type {
  CandidateExperienceViewModel,
  ExperiencePayload,
  LookupOptionSource,
} from '../types/profile.types';
import type { ExperienceModalFormData } from '../validation/experience-modal-schema';

type PayloadContext = Pick<ExperiencePayload, 'locale' | 'token'>;

export const EMPTY_EXPERIENCE_FORM: ExperienceModalFormData = {
  jobTitle: '',
  otherJobTitle: '',
  organizationOrHospitalName: '',
  employmentTypeId: '',
  countryId: '',
  cityId: '',
  startDate: '',
  endDate: '',
  workHere: false,
  responsibilities: [{ value: '' }],
};

export function findJobTitleId(title: string, jobTitles: LookupOptionSource[]) {
  const normalizedTitle = title.trim().toLowerCase();
  const matchedJobTitle = jobTitles.find(
    (jobTitle) => jobTitle.title?.trim().toLowerCase() === normalizedTitle,
  );

  return matchedJobTitle ? String(matchedJobTitle.id) : null;
}

export function toExperienceFormState(
  experience?: CandidateExperienceViewModel | null,
): ExperienceModalFormData {
  if (!experience) {
    return EMPTY_EXPERIENCE_FORM;
  }

  return {
    jobTitle: OTHER_JOB_TITLE_VALUE,
    otherJobTitle: experience.title,
    organizationOrHospitalName: experience.organization ?? '',
    employmentTypeId: experience.employmentTypeId ?? '',
    countryId: experience.countryId ?? '',
    cityId: experience.cityId ?? '',
    startDate: experience.startDate ?? '',
    endDate: experience.endDate ?? '',
    workHere: experience.isCurrent,
    responsibilities:
      experience.bullets.length > 0
        ? experience.bullets.map((bullet) => ({ value: bullet }))
        : [{ value: '' }],
  };
}

export function toExperiencePayload(
  form: ExperienceModalFormData,
  context: PayloadContext,
): ExperiencePayload {
  const isOtherJobTitle = form.jobTitle === OTHER_JOB_TITLE_VALUE;

  return {
    title: isOtherJobTitle ? form.otherJobTitle?.trim() : undefined,
    jobTitleId: isOtherJobTitle ? undefined : form.jobTitle,
    company: form.organizationOrHospitalName.trim(),
    employmentTypeId: form.employmentTypeId || undefined,
    countryId: form.countryId || undefined,
    cityId: form.cityId || undefined,
    startDate: form.startDate,
    endDate: form.workHere ? undefined : form.endDate?.trim(),
    isCurrent: Boolean(form.workHere),
    responsibilities: form.responsibilities.map((item) => item.value.trim()),
    ...context,
  };
}
