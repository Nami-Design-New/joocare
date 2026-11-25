import type {
  ApiCandidateAssessment,
  CandidateAssessment,
} from '../types/candidate-assessment.types';

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

export function mapApiCandidateAssessment(
  assessment: ApiCandidateAssessment,
): CandidateAssessment {
  return {
    id: String(assessment.id),
    assessmentId: String(assessment.assessment_id),
    title: assessment.title,
    source: assessment.source,
    status:
      assessment.status === 'grace_period' ? 'grace-period' : assessment.status,
    score: assessment.score,
    sentAt: assessment.sent_at,
    dueAt: assessment.due_at,
  };
}
