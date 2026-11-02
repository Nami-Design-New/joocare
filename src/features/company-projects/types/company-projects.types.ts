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
  status: 'Rejected' | 'Shortlist' | 'Under review';
  assessment: 'Passed' | 'Failed' | 'Not assigned';
  score?: number;
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
