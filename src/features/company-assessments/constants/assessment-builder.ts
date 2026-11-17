import type {
  AssessmentConfiguration,
  QuestionFormValues,
  QuestionOption,
  QuestionType,
} from '../types/assessment-builder.types';

export const MIN_ASSESSMENT_QUESTIONS = 2;
export const MAX_QUESTION_OPTIONS = 5;
export const QUESTION_REVIEW_PAGE_SIZE = 10;
export const ASSESSMENT_QUESTIONS_PAGE_SIZE = 2;
export const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
export const QUESTION_TYPES: QuestionType[] = [
  'yes-no',
  'single-choice',
  'multiple-choice',
];
export const YES_NO_ANSWERS = ['yes', 'no'];
export const QUESTION_TYPE_TO_API: Record<QuestionType, string> = {
  'yes-no': 'yes_no',
  'single-choice': 'single_choice',
  'multiple-choice': 'multi_choice',
};
export const API_TO_QUESTION_TYPE: Record<string, QuestionType> = {
  yes_no: 'yes-no',
  single_choice: 'single-choice',
  multi_choice: 'multiple-choice',
};
export const CONFIGURATION_DEFAULTS: AssessmentConfiguration = {
  title: '',
  description: '',
  passScore: '70',
  durationMinutes: '25',
};

export function createEmptyOptions(): QuestionOption[] {
  return Array.from({ length: 4 }, () => ({
    id: crypto.randomUUID(),
    text: '',
  }));
}

export function createQuestionDefaults(): QuestionFormValues {
  return {
    type: 'yes-no',
    score: '',
    questionText: '',
    options: createEmptyOptions(),
    correctAnswers: ['yes'],
    attachmentEnabled: false,
    attachment: null,
    existingAttachment: null,
  };
}
