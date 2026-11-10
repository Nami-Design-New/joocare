import type { TalentFilterField } from '../types/talent-database.types';

export const COUNTRIES = ['egypt', 'saudi-arabia', 'uae', 'qatar'] as const;
const TITLES = ['registered-nurse', 'icu-nurse', 'cardiologist', 'pharmacist'];
const YEARS = ['0-2', '3-5', '6-10', '11-plus'];

export const occupationalFields: TalentFilterField[] = [
  {
    key: 'current-title',
    options: TITLES,
    placeholder: 'current-title-placeholder',
  },
  { key: 'domain', options: ['healthcare', 'life-sciences'] },
  { key: 'specialty', kind: 'text', placeholder: 'specialty-placeholder' },
  {
    key: 'previous-title',
    options: TITLES,
    placeholder: 'previous-title-placeholder',
  },
  { key: 'category', options: ['nursing', 'medicine', 'pharmacy'] },
  {
    key: 'subspecialty',
    kind: 'text',
    placeholder: 'subspecialty-placeholder',
  },
];
export const experienceFields: TalentFilterField[] = [
  { key: 'experience', options: YEARS },
  { key: 'years-in-role', options: YEARS },
  {
    key: 'seniority',
    options: ['junior', 'mid-level', 'senior', 'consultant'],
  },
];
export const licensingFields: TalentFilterField[] = [
  { key: 'education', options: ['bachelors', 'masters', 'doctorate'] },
  { key: 'certifications', options: ['bls', 'acls', 'pals'] },
  { key: 'professional-license', options: ['scfhs', 'dha', 'doh', 'moh'] },
  { key: 'license-country', options: COUNTRIES },
  { key: 'license-status', options: ['valid', 'expired', 'in-progress'] },
  { key: 'verification', options: ['verified', 'not-verified'] },
];
export const languageFields: TalentFilterField[] = Array.from(
  { length: 3 },
  (_, index) => [
    { key: `language-${index + 1}`, options: ['english', 'arabic', 'french'] },
    {
      key: `proficiency-${index + 1}`,
      options: ['basic', 'intermediate', 'fluent', 'native'],
    },
  ],
).flat();
export const careerFields: TalentFilterField[] = [
  { key: 'preferred-titles', kind: 'multi', options: TITLES },
  { key: 'work-locations', kind: 'multi', options: COUNTRIES },
  {
    key: 'industries',
    kind: 'multi',
    options: ['hospitals', 'clinics', 'home-healthcare'],
  },
];
export const personalFields: TalentFilterField[] = [
  { key: 'nationality', options: ['egyptian', 'saudi', 'emirati', 'qatari'] },
  { key: 'country', options: COUNTRIES },
  { key: 'visa', options: ['resident', 'work-visa', 'requires-sponsorship'] },
  { key: 'gender', options: ['male', 'female'] },
  { key: 'city', options: ['cairo', 'riyadh', 'dubai', 'doha'] },
  { key: 'sponsorship', options: ['required', 'not-required'] },
  { key: 'marital-status', options: ['single', 'married'] },
];
export const employmentFields: TalentFilterField[] = [
  { key: 'employer', kind: 'text', placeholder: 'employer-placeholder' },
  {
    key: 'previous-employer',
    kind: 'text',
    placeholder: 'previous-employer-placeholder',
  },
  { key: 'employment-type', options: ['full-time', 'part-time', 'contract'] },
];
export const availabilityFields: TalentFilterField[] = [
  { key: 'availability', options: ['open-to-work', 'employed'] },
  { key: 'last-active', options: ['last-week', 'last-month'] },
  { key: 'notice-period', options: ['immediate', 'one-month', 'two-months'] },
];

export const TALENT_PAGE_SIZE = 5;
