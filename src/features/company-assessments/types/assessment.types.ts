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
