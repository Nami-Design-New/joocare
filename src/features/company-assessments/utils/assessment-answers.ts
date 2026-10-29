import { assessmentSeeds } from '../constants/assessment-data';
import {
  assessmentAnswerQuestions,
  assessmentAnswerAttemptSeed,
} from '../constants/assessment-answers';
import { externalInvitationSeeds } from '../constants/assessment-invitations';
import { assessmentResultAssessments } from '../constants/assessment-results';
import type {
  AssessmentAnswerQuestion,
  CandidateAssessmentPageProps,
  CandidateAssessmentResult,
} from '../types/assessment-answers.types';

export function getAnswerStatus(question: AssessmentAnswerQuestion) {
  if (!question.selectedOptionIds.length) return 'missing';
  return question.points === question.maxPoints ? 'correct' : 'wrong';
}

export function getCandidateAssessmentResult({
  assessmentId,
  candidateId,
  categoryId,
}: CandidateAssessmentPageProps): CandidateAssessmentResult | null {
  const candidate = externalInvitationSeeds.find(
    (item) => item.id === candidateId,
  );
  const assessment = categoryId
    ? assessmentSeeds.find(
        (item) => item.id === assessmentId && item.categoryId === categoryId,
      )
    : assessmentResultAssessments.find((item) => item.id === assessmentId);
  if (!candidate || candidate.score === null || !assessment) return null;

  return {
    candidate,
    assessmentTitle: 'title' in assessment ? assessment.title : assessment.name,
    assessmentHref: categoryId
      ? `/company/assessments/${categoryId}/${assessmentId}`
      : undefined,
    backHref: categoryId
      ? `/company/assessments/${categoryId}/${assessmentId}/external-invitations`
      : `/company/assessments-results?assessment=${assessmentId}`,
    ...assessmentAnswerAttemptSeed,
    questions: assessmentAnswerQuestions,
  };
}
