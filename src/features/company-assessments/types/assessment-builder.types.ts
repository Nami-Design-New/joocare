import type { AssessmentCategory } from './assessment.types';

export type QuestionType = 'yes-no' | 'single-choice' | 'multiple-choice';

export type AssessmentConfiguration = {
  title: string;
  description: string;
  passScore: string;
  durationMinutes: string;
};

export type QuestionOption = { id: string; text: string };

export type QuestionFormValues = {
  type: QuestionType;
  score: string;
  questionText: string;
  options: QuestionOption[];
  correctAnswers: string[];
  attachmentEnabled: boolean;
  attachment: File | null;
};

export type BuilderQuestion = QuestionFormValues & { id: string };

export type AssessmentDraft = {
  categoryId: string;
  configuration: AssessmentConfiguration;
  questions: BuilderQuestion[];
};

export type AssessmentBuilderProps = {
  categoryId: string;
  isEditing?: boolean;
  category?: AssessmentCategory;
  initialDraft?: AssessmentDraft;
  onSubmit?: (draft: AssessmentDraft) => Promise<void>;
};
