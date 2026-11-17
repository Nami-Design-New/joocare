import type { Option } from '@/shared/components/SelectInputField';
import { EMPTY_ADDITIONAL_INFO } from '../constants';
import type { AdditionalInfoValues } from '../types/additional-info.types';
import type {
  ProfileDetails,
  ProfileDetailsLookup,
} from '../types/profile-details.types';

// Labels of the saved lookup choices, by form field, so a select can show a saved
// value that isn't in the options it has loaded yet.
export type SavedOptions = Partial<
  Record<keyof AdditionalInfoValues, Option[]>
>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

function isLookup(value: unknown): value is ProfileDetailsLookup {
  return (
    isRecord(value) &&
    (typeof value.id === 'number' || typeof value.id === 'string')
  );
}

function toOption(value: unknown): Option | null {
  if (!isLookup(value)) return null;
  return { value: String(value.id), label: value.name ?? value.title ?? '' };
}

function toOptions(values: unknown): Option[] {
  if (!Array.isArray(values)) return [];
  return values.flatMap((value) => toOption(value) ?? []);
}

// Fixed choices come back as a plain value or as `{ value, label }`.
function toEnumValue(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (
    isRecord(value) &&
    (typeof value.value === 'string' || typeof value.value === 'number')
  ) {
    return String(value.value);
  }
  return '';
}

function toYesNo(value: unknown): AdditionalInfoValues['relocation'] {
  if (value === null || value === undefined || value === '') return '';
  return value === true || value === 1 || value === '1' ? 'yes' : 'no';
}

// Salaries come back as decimals ("5000.00"); show them as typed ("5000").
function toAmount(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const amount = Number(value);
  return Number.isNaN(amount) ? String(value) : String(amount);
}

function toLanguages(items: unknown[] | undefined) {
  const languages = (items ?? []).map((item) => ({
    language: isRecord(item) ? toEnumValue(item.language) : '',
    proficiency: isRecord(item) ? toEnumValue(item.proficiency_level) : '',
  }));
  return EMPTY_ADDITIONAL_INFO.languages.map(
    (empty, index) => languages[index] ?? empty,
  );
}

function toPrivileges(items: unknown[] | undefined): string[] {
  return (items ?? []).flatMap((item) => {
    if (typeof item === 'string') return [item];
    if (isRecord(item) && typeof item.title === 'string') return [item.title];
    if (isRecord(item) && typeof item.name === 'string') return [item.name];
    return [];
  });
}

const one = (value: unknown): Option[] => {
  const option = toOption(value);
  return option ? [option] : [];
};

// Currency selects show the code (USD, SAR, ...).
const oneCurrency = (value: unknown): Option[] =>
  one(value).map((option) => ({
    ...option,
    label:
      isRecord(value) && typeof value.code === 'string'
        ? value.code
        : option.label,
  }));

// Saved lookup choices with their labels, by form field.
export function toSavedOptions(details: ProfileDetails): SavedOptions {
  const {
    qualifications,
    mobility,
    personal_details: personal,
    salary,
  } = details;
  const career = details.career_preferences;

  return {
    yearsInRole: one(qualifications?.current_role_experience),
    seniorityLevel: one(qualifications?.seniority_level),
    educationLevel: one(qualifications?.education_level),
    certifications: toOptions(qualifications?.mandatory_certifications),
    professionalLicenseCountries: one(qualifications?.license?.country),
    preferredCountries: toOptions(mobility?.relocation_countries),
    licenseCountries: toOptions(mobility?.driving_license_countries),
    designations: toOptions(career?.job_titles),
    workLocations: toOptions(career?.preferred_countries),
    industries: toOptions(career?.domains),
    noticePeriod: one(career?.availability),
    nationality: one(personal?.nationality),
    currentCountry: one(personal?.country),
    currentCity: one(personal?.city),
    currentCurrency: oneCurrency(salary?.current_salary_currency),
    expectedCurrency: oneCurrency(salary?.expected_salary_currency),
  };
}

// Maps the grouped API response to the flat form values.
// The professional license field stays empty: the API stores a license number,
// not a `/licenses` choice (Q-B19).
export function toAdditionalInfoForm(
  details: ProfileDetails,
): AdditionalInfoValues {
  const {
    qualifications,
    mobility,
    personal_details: personal,
    salary,
  } = details;
  const career = details.career_preferences;
  const license = qualifications?.license;
  const savedOptions = toSavedOptions(details);

  const firstId = (field: keyof SavedOptions) =>
    savedOptions[field]?.[0]?.value ?? '';
  const ids = (field: keyof SavedOptions) =>
    savedOptions[field]?.map((option) => option.value) ?? [];
  const sponsorship = toEnumValue(personal?.sponsorship_requirement);

  return {
    ...EMPTY_ADDITIONAL_INFO,
    yearsInRole: firstId('yearsInRole'),
    seniorityLevel: firstId('seniorityLevel'),
    educationLevel: firstId('educationLevel'),
    certifications: ids('certifications'),
    professionalLicenseCountries: ids('professionalLicenseCountries'),
    licenseStatus: toEnumValue(license?.status),
    verificationStatus: toEnumValue(license?.verification_status),
    languages: toLanguages(details.languages),
    relocation: toYesNo(mobility?.willing_to_relocate),
    preferredCountries: ids('preferredCountries'),
    drivingLicense: toYesNo(mobility?.has_driving_license),
    licenseCountries: ids('licenseCountries'),
    designations: ids('designations'),
    workLocations: ids('workLocations'),
    industries: ids('industries'),
    noticePeriod: firstId('noticePeriod'),
    jobSearchStatus: toEnumValue(career?.job_search_status),
    clinicalPrivileges: toPrivileges(details.clinical_privileges),
    nationality: firstId('nationality'),
    currentCountry: firstId('currentCountry'),
    visaStatus: toEnumValue(personal?.visa_status),
    gender: toEnumValue(personal?.gender),
    currentCity: firstId('currentCity'),
    sponsorship: sponsorship ? [sponsorship] : [],
    maritalStatus: toEnumValue(personal?.marital_status),
    currentSalary: toAmount(salary?.current_salary),
    currentCurrency:
      firstId('currentCurrency') || EMPTY_ADDITIONAL_INFO.currentCurrency,
    expectedMin: toAmount(salary?.expected_salary_min),
    expectedMax: toAmount(salary?.expected_salary_max),
    expectedCurrency:
      firstId('expectedCurrency') || EMPTY_ADDITIONAL_INFO.expectedCurrency,
  };
}
