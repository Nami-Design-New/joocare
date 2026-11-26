export type CandidateAssessmentStatus =
  | 'passed'
  | 'failed'
  | 'absent'
  | 'pending'
  | 'under-review'
  | 'grace-period';

// `not-assigned` is a filter/display state only: the candidate has no assessment.
export type CandidateAssessmentFilterStatus =
  | CandidateAssessmentStatus
  | 'not-assigned';

export type CandidateAssessment = {
  id: string;
  assessmentId: string;
  title: string;
  source: 'job' | 'manual';
  status: CandidateAssessmentStatus;
  score: number | null;
  sentAt: string;
  dueAt: string | null;
};

// A candidate's assessment in the pipeline and project candidate APIs.
export type ApiCandidateAssessment = {
  id: number;
  assessment_id: number;
  title: string;
  source: 'job' | 'manual';
  status:
    | 'passed'
    | 'failed'
    | 'absent'
    | 'pending'
    | 'under_review'
    | 'grace_period';
  score: number | null;
  score_percent?: number | null;
  sent_at: string;
  due_at: string | null;
};

export type AssessmentCandidateSummary = {
  id: string;
  name: string;
  image: string;
  location: string | null;
  email: string;
};

export type CandidateAssessmentAction = {
  type: 'list' | 'assign';
  candidate: AssessmentCandidateSummary;
  assessments: CandidateAssessment[];
} | null;
