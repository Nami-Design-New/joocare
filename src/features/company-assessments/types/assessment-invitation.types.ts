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
  image: string;
  status: InvitationStatus;
  date: string;
  score: number | null;
  project: string;
};
