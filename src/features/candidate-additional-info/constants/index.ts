import type {
  AdditionalInfoSectionKey,
  JobSearchStatus,
} from '../types/additional-info.types';

// Number of language rows in the form (the design allows up to 3 languages).
export const LANGUAGE_SLOTS = 3;

// Default salary currency: US Dollar (`/currencies` id 1).
export const DEFAULT_CURRENCY_ID = '1';

const ICONS_PATH = '/assets/icons/additional-info';

export const SECTION_ICONS: Record<AdditionalInfoSectionKey, string> = {
  qualifications: `${ICONS_PATH}/qualifications.svg`,
  languages: `${ICONS_PATH}/world.svg`,
  mobility: `${ICONS_PATH}/world.svg`,
  career: `${ICONS_PATH}/briefcase.svg`,
  professional: `${ICONS_PATH}/professional.svg`,
  personal: `${ICONS_PATH}/user.svg`,
  salary: `${ICONS_PATH}/salary.svg`,
};

export const MOBILITY_ICONS = {
  relocation: '/assets/icons/mobility/plane.svg',
  drivingLicense: '/assets/icons/mobility/car.svg',
} as const;

// Fixed choices owned by the UI; labels come from `candidatePage.additional-info.options`.
export const LICENSE_STATUSES = ['valid', 'expired', 'pending'] as const;
export const VERIFICATION_STATUSES = [
  'verified',
  'pending',
  'not-verified',
] as const;
export const PROFICIENCY_LEVELS = [
  'basic',
  'intermediate',
  'advanced',
  'fluent',
  'native',
] as const;
export const GENDERS = ['male', 'female'] as const;
export const MARITAL_STATUSES = [
  'single',
  'married',
  'divorced',
  'widowed',
] as const;
export const VISA_STATUSES = [
  'citizen',
  'resident',
  'work-visa',
  'visit-visa',
  'no-visa',
] as const;
export const SPONSORSHIP_OPTIONS = ['required', 'not-required'] as const;

export const JOB_SEARCH_STATUSES: readonly {
  value: JobSearchStatus;
  dotClassName: string;
}[] = [
  { value: 'open-to-work', dotClassName: 'bg-job-status-open' },
  { value: 'actively-looking', dotClassName: 'bg-job-status-active' },
  { value: 'open-to-opportunities', dotClassName: 'bg-job-status-passive' },
];

// Sections tracked by the profile completion checklist (in display order).
export const COMPLETION_SECTIONS: readonly AdditionalInfoSectionKey[] = [
  'qualifications',
  'languages',
  'mobility',
  'career',
  'professional',
  'personal',
];
