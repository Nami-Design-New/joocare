import type { CandidateAssessment } from '../types/candidate-assessment.types';

export const SHORT_DATE_FORMAT = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
} as const;

export function getAssessmentResultHref(
  assessmentId: string,
  resultId: string,
) {
  return `/company/assessments-results/${assessmentId}/${resultId}`;
}

export function hasAssessmentScore(assessment: CandidateAssessment) {
  return (
    (assessment.status === 'passed' || assessment.status === 'failed') &&
    assessment.score !== null
  );
}
