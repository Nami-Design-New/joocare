export type ProjectShareLog = {
  id: string;
  manager: string;
  managerEmail: string;
  sharedBy: string;
  sharedByRole: string;
  date: string;
  time: string;
};

export type CompanyProject = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  recruiter: string;
  candidateInitials: string[];
  additionalCandidates: number;
  isClosed: boolean;
  shareLogs: ProjectShareLog[];
};

export type ProjectCandidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  /** CV file URL (`cv` from the API, as in received applications). */
  cv: string | null;
  status: 'Rejected' | 'Shortlist' | 'Under review';
  assessment: 'Passed' | 'Failed' | 'Not assigned';
  score?: number;
  /** Ids of the candidate's result in Assessments Results ("View result"). */
  assessmentResult?: { assessmentId: string; candidateId: string };
  interview?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewType?: string;
  scheduledBy?: string;
  scheduledByRole?: string;
  note?: string;
};

export type CandidateAction = {
  type: 'share' | 'view-cv' | 'remove' | 'note';
  candidateId: string;
} | null;

export type ProjectAction = {
  type: 'share' | 'edit' | 'close' | 'delete' | 'log';
  projectId: string;
} | null;

// Minimal candidate info the project modals need, whichever page opens them.
export type ProjectCandidateRef = {
  id: string;
  name: string;
};

export type CandidateProjectAction = {
  type: 'create' | 'link';
  candidate: ProjectCandidateRef;
} | null;

export type ProjectOption = {
  id: string;
  name: string;
  candidateCount: number;
};
