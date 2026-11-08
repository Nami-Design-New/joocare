import type { ScreeningQuestion } from './job-steps.types';

// Screening question as the candidate answers it (the employer's correct answers aren't needed here).
export type ApplyScreeningQuestion = Pick<
  ScreeningQuestion,
  'id' | 'question' | 'options' | 'required'
> & {
  type: ScreeningQuestion['type'] | 'text';
  placeholder?: string;
};

// Choice questions fill `selected` (option ids); short-answer questions fill `text`.
export type ScreeningAnswer = {
  questionId: string;
  selected: string[];
  text: string;
};

export type ScreeningAnswersFormValues = {
  answers: ScreeningAnswer[];
};

export type ApplyCvSource = 'profile' | 'upload';

export type ApplyAssessmentInvite = {
  id: string;
  title: string;
};

export type ApplySubmission = {
  submittedAt: Date;
  assessment: ApplyAssessmentInvite | null;
};
