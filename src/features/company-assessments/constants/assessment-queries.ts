import type { AssessmentSource } from '../types/assessment.types';

export const CATEGORY_PAGE_SIZE = 9;
export const CATEGORY_OPTIONS_PAGE_SIZE = 10;
export const ASSESSMENT_SEARCH_DEBOUNCE_MS = 400;

// Static until the backend returns these counts. The UI marks them with `#`.
export const STATIC_CATEGORY_ASSESSMENT_COUNT = 0;
export const STATIC_ASSESSMENT_ASSOCIATED_JOBS = 0;
export const STATIC_ASSESSMENT_EXTERNAL_INVITATIONS = 0;

export const assessmentQueryKeys = {
  categories: (locale: string, source: AssessmentSource) => [
    'assessment-categories',
    locale,
    source,
  ],
  categoryOptions: (locale: string, search: string) => [
    'all-assessment-categories',
    locale,
    search,
  ],
  category: (locale: string, categoryId: string) => [
    'assessment-category',
    locale,
    categoryId,
  ],
  assessments: (
    locale: string,
    categoryId: string,
    search: string,
    page: number,
  ) => ['assessments', locale, categoryId, search, page],
  assessmentOptions: (locale: string, categoryId: string) => [
    'assessments',
    locale,
    categoryId,
    'options',
  ],
  assessment: (locale: string, assessmentId: string) => [
    'assessment',
    locale,
    assessmentId,
  ],
  questions: (locale: string, assessmentId: string, page: number) => [
    'assessment-questions',
    locale,
    assessmentId,
    page,
  ],
  question: (locale: string, questionId: string) => [
    'assessment-question',
    locale,
    questionId,
  ],
  questionTypes: (locale: string) => ['assessment-question-types', locale],
};

// Prefixes invalidated after a mutation (they match every locale and filter).
export const CATEGORY_QUERY_PREFIXES = [
  ['assessment-categories'],
  ['all-assessment-categories'],
  ['assessment-category'],
];
export const ASSESSMENT_QUERY_PREFIXES = [
  ['assessments'],
  ['assessment'],
  ['assessment-questions'],
  ['assessment-question'],
];
