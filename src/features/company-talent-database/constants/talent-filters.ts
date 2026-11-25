import type { TalentFilterField } from '../types/talent-database.types';

// Preview options for AI Talent Match, which has no API yet.
export const COUNTRIES = ['egypt', 'saudi-arabia', 'uae', 'qatar'] as const;

export const TALENT_PAGE_SIZE = 5;
export const TALENT_SKELETON_ROWS = 5;
export const TALENT_SEARCH_QUERY_KEY = 'candidates-search';
export const TALENT_AVATAR_FALLBACK =
  '/assets/company-projects/candidate-avatar.png';
export const LANGUAGE_SLOTS = 3;
export const PROFESSIONAL_LICENSE_VALUES = [
  'with_medical_license',
  'without_medical_license',
] as const;

export const occupationalFields: TalentFilterField[] = [
  {
    key: 'current-title',
    param: 'job_title_id',
    lookup: 'job-titles',
    placeholder: 'current-title-placeholder',
  },
  { key: 'domain', param: 'domain_id', lookup: 'domains' },
  {
    key: 'specialty',
    param: 'specialty',
    kind: 'text',
    placeholder: 'specialty-placeholder',
  },
  {
    key: 'previous-title',
    param: 'previous_job_title_id',
    lookup: 'job-titles',
    placeholder: 'previous-title-placeholder',
  },
  { key: 'category', param: 'category_id', lookup: 'categories' },
  {
    key: 'subspecialty',
    param: 'subspecialty',
    kind: 'text',
    placeholder: 'subspecialty-placeholder',
  },
];
export const experienceFields: TalentFilterField[] = [
  { key: 'experience', param: 'experience_id', lookup: 'experiences' },
  {
    key: 'years-in-role',
    param: 'current_role_experience_id',
    lookup: 'experiences',
  },
  { key: 'seniority', param: 'seniority_level_id', lookup: 'seniority-levels' },
];
export const licensingFields: TalentFilterField[] = [
  {
    key: 'education',
    param: 'education_level_id',
    lookup: 'education-levels',
  },
  {
    key: 'certifications',
    param: 'mandatory_certification_id',
    lookup: 'certifications',
  },
  {
    key: 'professional-license',
    param: 'professional_license',
    lookup: 'professional-licenses',
  },
  { key: 'license-country', param: 'license_country_id', lookup: 'countries' },
  {
    key: 'license-status',
    param: 'license_status',
    lookup: 'license-statuses',
  },
  {
    key: 'verification',
    param: 'license_verification_status',
    lookup: 'verification-statuses',
  },
];
export const languageFields: TalentFilterField[] = Array.from(
  { length: LANGUAGE_SLOTS },
  (_, index): TalentFilterField[] => [
    {
      key: `language-${index + 1}`,
      param: `languages[${index}][language]`,
      lookup: 'languages',
    },
    {
      key: `proficiency-${index + 1}`,
      param: `languages[${index}][proficiency_level]`,
      lookup: 'proficiency-levels',
    },
  ],
).flat();
export const careerFields: TalentFilterField[] = [
  {
    key: 'preferred-titles',
    param: 'job_title_ids',
    kind: 'multi',
    lookup: 'job-titles',
  },
  {
    key: 'work-locations',
    param: 'preferred_country_ids',
    kind: 'multi',
    lookup: 'countries',
  },
  { key: 'industries', param: 'domain_ids', kind: 'multi', lookup: 'domains' },
];
export const personalFields: TalentFilterField[] = [
  { key: 'nationality', param: 'nationality_id', lookup: 'countries' },
  {
    key: 'country',
    param: 'country_id',
    lookup: 'countries',
    resets: ['city'],
  },
  { key: 'visa', param: 'visa_status', lookup: 'visa-statuses' },
  { key: 'gender', param: 'gender', lookup: 'genders' },
  { key: 'city', param: 'city_id', lookup: 'cities' },
  {
    key: 'sponsorship',
    param: 'sponsorship_requirement',
    lookup: 'sponsorship-requirements',
  },
  {
    key: 'marital-status',
    param: 'marital_status',
    lookup: 'marital-statuses',
  },
];
export const salaryRanges = (['current', 'expected'] as const).map((range) => ({
  range,
  fields: [
    {
      key: `${range}-min`,
      param: `${range}_salary_min`,
      kind: 'number',
      placeholder: 'minimum',
    },
    {
      key: `${range}-max`,
      param: `${range}_salary_max`,
      kind: 'number',
      placeholder: 'maximum',
    },
    {
      key: `${range}-currency`,
      param: `${range}_salary_currency_id`,
      lookup: 'currencies',
    },
  ] satisfies TalentFilterField[],
}));
export const employmentFields: TalentFilterField[] = [
  {
    key: 'employer',
    param: 'current_employer',
    kind: 'text',
    placeholder: 'employer-placeholder',
  },
  {
    key: 'previous-employer',
    param: 'previous_employer',
    kind: 'text',
    placeholder: 'previous-employer-placeholder',
  },
  {
    key: 'employment-type',
    param: 'employment_type_id',
    lookup: 'employment-types',
  },
];
export const keywordField: TalentFilterField = {
  key: 'keywords',
  param: 'keywords',
  kind: 'multi',
};
export const availabilityFields: TalentFilterField[] = [
  {
    key: 'availability',
    param: 'job_search_status',
    lookup: 'job-search-statuses',
  },
  { key: 'last-active', param: 'last_active', lookup: 'last-active' },
  { key: 'notice-period', param: 'availability_id', lookup: 'notice-periods' },
];

// Yes / No questions: `yes` sends 1, `no` sends 0, no answer sends nothing.
export const mobilityQuestions = [
  {
    key: 'relocation',
    param: 'willing_to_relocate',
    icon: '/assets/icons/mobility/plane.svg',
    countries: [
      {
        key: 'preferred-countries',
        param: 'relocation_country_ids',
        kind: 'multi',
        lookup: 'countries',
        placeholder: 'search-countries',
      },
    ] satisfies TalentFilterField[],
  },
  {
    key: 'driving-license',
    param: 'has_driving_license',
    icon: '/assets/icons/mobility/car.svg',
    countries: [
      {
        key: 'issuing-countries',
        param: 'driving_license_country_ids',
        kind: 'multi',
        lookup: 'countries',
        placeholder: 'search-countries',
      },
    ] satisfies TalentFilterField[],
  },
];

// Every field sent to `candidates/search`, used to build the query.
export const talentSearchFields: TalentFilterField[] = [
  ...occupationalFields,
  ...experienceFields,
  ...licensingFields,
  ...languageFields,
  ...mobilityQuestions.flatMap(({ countries }) => countries),
  ...careerFields,
  ...personalFields,
  ...salaryRanges.flatMap(({ fields }) => fields),
  ...employmentFields,
  keywordField,
  ...availabilityFields,
];
