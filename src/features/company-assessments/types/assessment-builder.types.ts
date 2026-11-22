import type { AssessmentSource } from './assessment.types';

export type QuestionType = 'yes-no' | 'single-choice' | 'multiple-choice';

export type AssessmentConfiguration = {
  title: string;
  description: string;
  passScore: string;
  durationMinutes: string;
};

export type QuestionOption = { id: string; text: string };

export type QuestionAttachment = { id: number; url: string };

export type QuestionFormValues = {
  type: QuestionType;
  score: string;
  questionText: string;
  options: QuestionOption[];
  correctAnswers: string[];
  attachmentEnabled: boolean;
  attachment: File | null;
  existingAttachment: QuestionAttachment | null;
};

export type BuilderQuestion = QuestionFormValues & { id: string };

export type QuestionTypeOption = { value: QuestionType; label: string };

export type SavedAssessmentQuestion = {
  id: string;
  questionText: string;
  type: QuestionType | null;
  typeLabel: string;
  score: number;
};

export type SavedAssessment = {
  id: string;
  categoryId: string;
  categoryName: string;
  source: AssessmentSource;
  configuration: AssessmentConfiguration;
  attemptsCount: number;
  questionCount: number;
  questionTypeCounts: Record<QuestionType, number>;
  questions: SavedAssessmentQuestion[];
  totalScore: number;
  /** Relative text from the API (e.g. "2 days ago"), shown as is. */
  createdAt: string;
};

export type SaveAssessmentPayload = {
  assessmentId: string | null;
  categoryId: string;
  configuration: AssessmentConfiguration;
};

export type SaveQuestionPayload = {
  questionId: string | null;
  assessmentId: string;
  values: QuestionFormValues;
  deleteFileIds: number[];
};

export type AssessmentBuilderProps = {
  categoryId: string;
  initialAssessment?: SavedAssessment;
};

export type QuestionAnswerApiItem = {
  id: number;
  answer: string;
  is_correct: boolean;
};

export type QuestionFileApiItem = { id: number; file: string };

export type AssessmentQuestionApiItem = {
  id: number;
  type: string;
  type_label: string;
  score: number;
  question: string;
  answers?: QuestionAnswerApiItem[];
  files?: QuestionFileApiItem[];
};

export type QuestionTypeApiItem = { value: string; label: string };
