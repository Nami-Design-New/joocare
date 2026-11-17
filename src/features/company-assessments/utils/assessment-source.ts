import type { AssessmentSource } from '../types/assessment.types';

// Category pages read the library from `?source=`; unknown values stay read-only.
export function parseAssessmentSource(value?: string): AssessmentSource {
  return value === 'company' ? 'company' : 'joocare';
}

export function getCategoryHref(categoryId: string, source: AssessmentSource) {
  return `/company/assessments/${categoryId}?source=${source}`;
}
