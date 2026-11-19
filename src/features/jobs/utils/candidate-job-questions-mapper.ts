import type { ApplyScreeningQuestion } from '../types/job-apply.types';
import type { JobQuestionApiItem } from '../types/jobs.types';

const QUESTION_TYPES: Record<
  string,
  ApplyScreeningQuestion['type'] | undefined
> = {
  yes_no: 'yes-no',
  single_choice: 'single',
  multi_choice: 'multi',
};

// Preserve API answer ids without exposing the employer's correct answers.
export function mapCandidateJobQuestions(
  questions: JobQuestionApiItem[],
  labels: { yes: string; no: string },
): ApplyScreeningQuestion[] | null {
  const mapped: ApplyScreeningQuestion[] = [];
  for (const question of questions) {
    const type = QUESTION_TYPES[question.type];
    if (
      !type ||
      !Array.isArray(question.answers) ||
      question.answers.length < 2 ||
      question.answers.some(
        (answer) =>
          typeof answer.answer !== 'string' ||
          !answer.answer.trim() ||
          !Number.isInteger(answer.id) ||
          answer.id <= 0,
      )
    ) {
      return null;
    }
    mapped.push({
      id: String(question.id),
      type,
      question: question.question,
      required: question.is_required,
      options: question.answers.map((answer) => {
        const value = answer.answer.trim().toLowerCase();
        return {
          id: String(answer.id),
          text:
            type === 'yes-no' && (value === 'yes' || value === 'no')
              ? labels[value]
              : answer.answer,
        };
      }),
    });
  }
  return mapped;
}
