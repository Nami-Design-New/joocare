import type { AssessmentAnswerQuestion } from '../types/assessment-answers.types';

export function getAnswerStatus(question: AssessmentAnswerQuestion) {
  if (!question.selectedOptionIds.length) return 'missing';
  return question.points === question.maxPoints ? 'correct' : 'wrong';
}
