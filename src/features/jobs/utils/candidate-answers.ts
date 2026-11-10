import type {
  CandidateAnswerQuestion,
  CandidateAnswerResult,
} from '../types/candidate-answers.types';

// Skipped → missing; same picks as the correct answers → correct; anything else → wrong.
export function getAnswerResult(
  question: CandidateAnswerQuestion,
): CandidateAnswerResult {
  const { selectedOptionIds, correctOptionIds } = question;
  if (!selectedOptionIds.length) return 'missing';
  const isCorrect =
    selectedOptionIds.length === correctOptionIds.length &&
    selectedOptionIds.every((id) => correctOptionIds.includes(id));
  return isCorrect ? 'correct' : 'wrong';
}

export function countAnswerResults(questions: CandidateAnswerQuestion[]) {
  const counts: Record<CandidateAnswerResult, number> = {
    correct: 0,
    wrong: 0,
    missing: 0,
  };
  questions.forEach((question) => {
    counts[getAnswerResult(question)] += 1;
  });
  return counts;
}
