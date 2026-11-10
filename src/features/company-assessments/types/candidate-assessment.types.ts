export type CandidateAssessmentStatus =
  | 'passed'
  | 'failed'
  | 'absent'
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
