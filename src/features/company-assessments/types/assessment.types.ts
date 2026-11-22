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

export type AssessmentCreatorApiItem = {
  name: string;
  display_role: string | null;
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
  category?: { id: number; name: string; is_global: boolean };
  questions?: AssessmentQuestionSummaryApiItem[];
  jobs_count?: number;
  invitations_count?: number;
  /** `false` while the company has paused the assessment. */
  is_active?: boolean;
  /** Company admin who created it (details endpoint only). */
  company_admin?: AssessmentCreatorApiItem | null;
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
  isPaused: boolean;
};
