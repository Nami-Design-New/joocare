import type { AssessmentAttempt } from '../types/assessment-api.types';
import type { CandidateAssessmentQuestion } from '../types/candidate-assessment.types';

export function mapAssessmentQuestion(
  question: NonNullable<AssessmentAttempt['next_question']>,
  labels: { yes: string; no: string },
): CandidateAssessmentQuestion {
  const type =
    question.type === 'multi_choice'
      ? 'multi'
      : question.type === 'yes_no'
        ? 'yes-no'
        : 'single';

  return {
    id: String(question.id),
    text: question.question,
    type,
    options: question.answers.map((answer) => {
      const value = answer.answer.trim().toLowerCase();
      return {
        id: String(answer.id),
        // Yes/no answers come back as raw "yes"/"no"; show the localized label.
        text:
          type === 'yes-no' && (value === 'yes' || value === 'no')
            ? labels[value]
            : answer.answer,
      };
    }),
  };
}
