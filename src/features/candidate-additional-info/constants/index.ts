import type {
  AdditionalInfoSectionKey,
  AdditionalInfoValues,
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

// Value of the "Other" choice in the multi-selects that accept free text.
export const OTHER_OPTION = 'other';

// Status dot colors by `/job-search-statuses` value (labels come from the API).
export const JOB_SEARCH_STATUS_DOTS: Record<string, string> = {
  open_to_work: 'bg-job-status-open',
  actively_looking: 'bg-job-status-active',
  open_to_opportunities: 'bg-job-status-passive',
};

// Sections tracked by the profile completion checklist (in display order).
export const COMPLETION_SECTIONS: readonly AdditionalInfoSectionKey[] = [
  'qualifications',
  'languages',
  'mobility',
  'career',
  'professional',
  'personal',
];

// Form values before anything is saved.
export const EMPTY_ADDITIONAL_INFO: AdditionalInfoValues = {
  yearsInRole: '',
  seniorityLevel: '',
  educationLevel: '',
  certifications: [],
  otherCertification: '',
  professionalLicense: '',
  professionalLicenseCountries: [],
  otherLicenseCountry: '',
  licenseStatus: '',
  verificationStatus: '',
  languages: Array.from({ length: LANGUAGE_SLOTS }, () => ({
    language: '',
    proficiency: '',
  })),
  relocation: '',
  preferredCountries: [],
  drivingLicense: '',
  licenseCountries: [],
  designations: [],
  workLocations: [],
  industries: [],
  noticePeriod: '',
  jobSearchStatus: '',
  clinicalPrivileges: [],
  nationality: '',
  currentCountry: '',
  visaStatus: '',
  gender: '',
  currentCity: '',
  sponsorship: [],
  maritalStatus: '',
  currentSalary: '',
  currentCurrency: DEFAULT_CURRENCY_ID,
  expectedMin: '',
  expectedMax: '',
  expectedCurrency: DEFAULT_CURRENCY_ID,
};
