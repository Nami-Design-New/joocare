export type AssignmentCandidate = {
  id: string;
  name: string;
  country: string | null;
  email: string;
  image: string | null;
};

export type AssignmentCandidatesPage = {
  data: AssignmentCandidate[];
  next_page_url: string | null;
};

export type AssessmentAssignmentPayload = {
  assessmentId: string;
  userIds: string[];
  emails: string[];
};

export type AssignmentRequestOptions = { token: string; locale: string };

export type InvitationStatus = 'passed' | 'failed' | 'pending' | 'absent';

export type ExternalInvitation = {
  id: string;
  name: string;
  email: string;
  /** Local asset file name (preview data) or an absolute API URL. */
  image: string | null;
  status: InvitationStatus;
  date: string | null;
  /** CV file URL from the API; preview rows have none. */
  cv?: string | null;
  score: number | null;
  project: string;
};
