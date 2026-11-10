import type { Option } from '@/shared/components/SelectInputField';
import type { AdditionalInfoValues } from '../types/additional-info.types';
import { DEFAULT_CURRENCY_ID, LANGUAGE_SLOTS } from '.';

// Local design fixtures until the additional information API is ready. Values are shown as is (not translated).
const toOptions = (labels: string[]): Option[] =>
  labels.map((label) => ({ value: label, label }));

// No languages / industries lookups exist yet.
export const LANGUAGE_OPTIONS = toOptions([
  'Arabic',
  'English',
  'French',
  'German',
  'Spanish',
  'Hindi',
  'Urdu',
  'Malayalam',
  'Tagalog',
]);

export const INDUSTRY_OPTIONS = toOptions([
  'Hospitals',
  'Clinics',
  'Home Healthcare',
  'Pharmaceuticals',
  'Medical Devices',
  'Laboratories',
  'Health Insurance',
]);

const PREVIEW_LANGUAGES = [
  { language: 'Arabic', proficiency: 'native' },
  { language: 'English', proficiency: 'fluent' },
];

export const ADDITIONAL_INFO_PREVIEW: AdditionalInfoValues = {
  yearsInRole: '',
  seniorityLevel: '',
  educationLevel: '',
  certifications: [],
  professionalLicense: '',
  licenseCountry: '',
  licenseStatus: '',
  verificationStatus: '',
  languages: Array.from(
    { length: LANGUAGE_SLOTS },
    (_, index) => PREVIEW_LANGUAGES[index] ?? { language: '', proficiency: '' },
  ),
  relocation: 'yes',
  preferredCountries: [],
  drivingLicense: 'yes',
  licenseCountries: [],
  designations: [],
  workLocations: [],
  industries: ['Hospitals', 'Home Healthcare'],
  noticePeriod: '',
  jobSearchStatus: 'open-to-work',
  clinicalPrivileges: [
    'Endoscopy',
    'Colonoscopy',
    'Minor Surgical Procedures',
    'Upper GI Bleeding Management',
  ],
  nationality: '',
  currentCountry: '',
  visaStatus: '',
  gender: '',
  currentCity: '',
  sponsorship: '',
  maritalStatus: '',
  currentSalary: '',
  currentCurrency: DEFAULT_CURRENCY_ID,
  expectedMin: '',
  expectedMax: '',
  expectedCurrency: DEFAULT_CURRENCY_ID,
};
