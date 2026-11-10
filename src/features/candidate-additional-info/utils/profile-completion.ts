import { COMPLETION_SECTIONS } from '../constants';
import type {
  AdditionalInfoSectionKey,
  AdditionalInfoValues,
  CompletionItem,
} from '../types/additional-info.types';

type Value = AdditionalInfoValues[keyof AdditionalInfoValues];

const isFilled = (value: Value): boolean => {
  if (Array.isArray(value))
    return value.some((item) =>
      typeof item === 'string' ? Boolean(item) : Boolean(item.language),
    );
  return Boolean(value);
};

// Fields that count towards each checklist section.
const SECTION_FIELDS: Record<
  AdditionalInfoSectionKey,
  (keyof AdditionalInfoValues)[]
> = {
  qualifications: [
    'yearsInRole',
    'seniorityLevel',
    'educationLevel',
    'certifications',
    'professionalLicense',
    'licenseCountry',
    'licenseStatus',
    'verificationStatus',
  ],
  languages: ['languages'],
  mobility: ['relocation', 'drivingLicense'],
  career: ['designations', 'workLocations', 'industries', 'noticePeriod'],
  professional: ['clinicalPrivileges'],
  personal: [
    'nationality',
    'currentCountry',
    'visaStatus',
    'gender',
    'currentCity',
    'sponsorship',
    'maritalStatus',
  ],
  salary: ['currentSalary', 'expectedMin', 'expectedMax'],
};

// A section is done when any of its fields is filled; the percentage counts every field.
export function getProfileCompletion(values: AdditionalInfoValues) {
  const items: CompletionItem[] = COMPLETION_SECTIONS.map((section) => ({
    section,
    done: SECTION_FIELDS[section].some((field) => isFilled(values[field])),
  }));
  const fields = COMPLETION_SECTIONS.flatMap(
    (section) => SECTION_FIELDS[section],
  );
  const filled = fields.filter((field) => isFilled(values[field])).length;

  return { items, percent: Math.round((filled / fields.length) * 100) };
}
