import type { AssessmentAttempt } from '../types/assessment-api.types';
import type { CandidateAssessmentQuestion } from '../types/candidate-assessment.types';

export function mapAssessmentQuestion(
  question: NonNullable<AssessmentAttempt['next_question']>,
): CandidateAssessmentQuestion {
  return {
    id: String(question.id),
    text: question.question,
    type:
      question.type === 'multi_choice'
        ? 'multi'
        : question.type === 'yes_no'
          ? 'yes-no'
          : 'single',
    options: question.answers.map((answer) => ({
      id: String(answer.id),
      text: answer.answer,
    })),
  };
}
