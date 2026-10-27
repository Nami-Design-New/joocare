export type AssessmentSource = 'joocare' | 'company';

export type AssessmentCategory = {
  id: string;
  source: AssessmentSource;
  name: string;
  description: string;
  assessmentCount: number;
};

export type CategoryFormValues = {
  name: string;
  description: string;
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
