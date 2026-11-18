export type AssessmentSource = 'joocare' | 'company';

export type AssessmentCategory = {
  id: string;
  source: AssessmentSource;
  name: string;
  description: string;
  assessmentCount: number;
};

export type AssessmentCategoryOption = {
  id: string;
  source: AssessmentSource;
  name: string;
  libraryLabel: string;
};

export type CategoryFormValues = {
  name: string;
  description: string;
};

export type PaginationMeta = {
  total: number;
  perPage: number;
  nextPage: number | null;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type AssessmentCategoryApiItem = {
  id: number;
  name: string;
  description: string | null;
  assessment_count: number;
};

export type AssessmentCategoryOptionApiItem = {
  id: number;
  name: string;
  is_global: boolean;
  library_label: string;
};

export type AssessmentQuestionSummaryApiItem = {
  id: number;
  type: string;
  type_label: string;
  score: number;
  question: string;
};

export type AssessmentApiItem = {
  id: number;
  name: string;
  description: string | null;
  assessment_category_id: number;
  passing_score: number;
  time_limit: number;
  attempts_count: number;
  questions_count: number;
  single_choice_questions_count: number;
  multi_choice_questions_count: number;
  yes_no_questions_count: number;
  questions?: AssessmentQuestionSummaryApiItem[];
  created_at: string;
};

export type CategorySeed = {
  id: string;
  source: AssessmentSource;
  name: string;
  description: string;
  assessmentCount: number;
};

export type Assessment = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  createdAt: string;
  questionCount: number;
  durationMinutes: number;
  passScore: number;
  associatedJobs: number;
  externalInvitations: number;
  pausedAt: string | null;
};

export type AssessmentQuestion = {
  id: string;
  questionText: string;
  type: string;
  score: number;
};

export type AssessmentDetail = {
  assessmentId: string;
  summaryTitle: string;
  summary: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  maxAttempts: number;
  allowedQuestionTypes: { label: string; count: number }[];
  pausedCandidateCount: number;
  questions: AssessmentQuestion[];
  creator: { name: string; role: string; initials: string };
};
