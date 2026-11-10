import type { ScreeningQuestion } from './job-steps.types';

// Screening question as the candidate answers it (the employer's correct answers aren't needed
// here). Only yes/no, single-select and multi-select exist — no short-answer type.
export type ApplyScreeningQuestion = Pick<
  ScreeningQuestion,
  'id' | 'question' | 'type' | 'options' | 'required'
>;

export type ScreeningAnswer = {
  questionId: string;
  selected: string[];
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
