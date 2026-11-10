import type { ScreeningQuestion } from './job-steps.types';

// One screening question with the employer's correct answers and what the candidate picked.
export type CandidateAnswerQuestion = Pick<
  ScreeningQuestion,
  'id' | 'question' | 'type' | 'options' | 'required' | 'correctOptionIds'
> & {
  /** Option ids the candidate picked; empty when the question was skipped. */
  selectedOptionIds: string[];
};

export type CandidateAnswerResult = 'correct' | 'wrong' | 'missing';

export type CandidateScreeningAnswers = {
  jobTitle: string;
  questions: CandidateAnswerQuestion[];
};
