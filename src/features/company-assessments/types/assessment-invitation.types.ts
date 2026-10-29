export type AssignmentCandidate = {
  id: string;
  name: string;
  shortName: string;
  country: string;
  email: string;
  image: string;
};

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
