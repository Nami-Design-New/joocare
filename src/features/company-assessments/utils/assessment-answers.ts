import { assessmentSeeds } from '../constants/assessment-data';
import {
  assessmentAnswerQuestions,
  assessmentAnswerAttemptSeed,
} from '../constants/assessment-answers';
import { externalInvitationSeeds } from '../constants/assessment-invitations';
import type {
  AssessmentAnswerQuestion,
  AssessmentResultHeaderData,
  CandidateAssessmentPageProps,
  CandidateAssessmentResult,
} from '../types/assessment-answers.types';

export function getAnswerStatus(question: AssessmentAnswerQuestion) {
  if (!question.selectedOptionIds.length) return 'missing';
  return question.points === question.maxPoints ? 'correct' : 'wrong';
}

// Preview result for the external invitations route (no API yet).
export function getCandidateAssessmentResult({
  assessmentId,
  candidateId,
  categoryId,
}: CandidateAssessmentPageProps): CandidateAssessmentResult | null {
  const candidate = externalInvitationSeeds.find(
    (item) => item.id === candidateId,
  );
  const assessment = assessmentSeeds.find(
    (item) => item.id === assessmentId && item.categoryId === categoryId,
  );
  if (!candidate || candidate.score === null || !assessment) return null;

  return {
    candidate,
    assessmentTitle: assessment.title,
    assessmentHref: `/company/assessments/${categoryId}/${assessmentId}`,
    backHref: `/company/assessments/${categoryId}/${assessmentId}/external-invitations`,
    ...assessmentAnswerAttemptSeed,
    questions: assessmentAnswerQuestions,
  };
}

export function toResultHeaderData(
  result: CandidateAssessmentResult,
): AssessmentResultHeaderData {
  const counts = { correct: 0, wrong: 0, missing: 0 };
  result.questions.forEach((question) => {
    counts[getAnswerStatus(question)] += 1;
  });
  return {
    candidate: result.candidate,
    scorePercent: result.candidate.score,
    assessmentTitle: result.assessmentTitle,
    assessmentHref: result.assessmentHref,
    sentAt: result.sentAt,
    startedAt: result.startedAt,
    finishedAt: result.finishedAt,
    durationSeconds: result.durationSeconds,
    counts,
    totalQuestions: result.questions.length,
  };
}
