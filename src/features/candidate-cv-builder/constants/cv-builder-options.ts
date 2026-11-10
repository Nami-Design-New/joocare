import type { Option } from '@/shared/components/SelectInputField';

// Design-only option lists until the CV builder is linked to the lookups API (not translated).
const toOptions = (labels: readonly string[]): Option[] =>
  labels.map((label) => ({ label, value: label }));

export const OTHER_JOB_TITLE = 'Other';

export const NATIONALITY_OPTIONS = toOptions([
  'Egyptian',
  'Emirati',
  'Saudi',
  'Jordanian',
  'Indian',
  'Filipino',
]);

export const MARITAL_STATUS_OPTIONS = toOptions([
  'Single',
  'Married',
  'Divorced',
  'Widowed',
]);

export const COUNTRY_OPTIONS = toOptions([
  'Egypt',
  'UAE',
  'Saudi Arabia',
  'Jordan',
  'Qatar',
  'Kuwait',
  'Austria',
]);

export const CONFERENCE_LOCATION_OPTIONS = toOptions([
  'Dubai, UAE',
  'Abu Dhabi, UAE',
  'Riyadh, Saudi Arabia',
  'Cairo, Egypt',
  'Vienna, Austria',
]);

export const LANGUAGE_OPTIONS = toOptions([
  'Arabic',
  'English',
  'French',
  'German',
  'Hindi',
]);

export const PROFICIENCY_OPTIONS = toOptions([
  'Native',
  'Fluent',
  'Advanced',
  'Intermediate',
  'Beginner',
]);

export const JOB_TITLE_OPTIONS = toOptions([
  'Consultant Internal Medicine',
  'Specialist Internal Medicine',
  'Registered Nurse',
  'Radiographer',
  'Pharmacist',
  OTHER_JOB_TITLE,
]);

export const YEARS_OF_EXPERIENCE_OPTIONS = toOptions([
  'Less than 1 year',
  '1–3 years',
  '3–5 years',
  '5–10 years',
  '10+ years',
]);

export const EMPLOYMENT_TYPE_OPTIONS = toOptions([
  'Full-time',
  'Part-time',
  'Contract',
  'Locum',
  'Internship',
]);

export const PUBLICATION_YEAR_OPTIONS = toOptions(
  Array.from({ length: 30 }, (_, index) => String(2026 - index)),
);

export const RECOMMENDED_SKILLS = [
  'Anesthesiology',
  'Rheumatology',
  'Oncology',
  'Ophthalmology',
  'Endocrinology',
  'Emergency Medicine',
  'Psychiatry',
  'Urology',
  'Pediatrics',
  'Infectious Diseases',
  'Orthopedics',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Radiology',
  'Nephrology',
];
