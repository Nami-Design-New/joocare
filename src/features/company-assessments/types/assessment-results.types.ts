import type { ExternalInvitation } from './assessment-invitation.types';

export type AssessmentResultCategory = {
  id: string;
  name: string;
};

export type AssessmentResultAssessment = {
  id: string;
  categoryId: string;
  name: string;
};

export type CandidateLinkKind = 'job' | 'project';

export type CandidateLinkTarget = {
  id: string;
  name: string;
  organization: string;
  location: string;
  associatedCount: number;
  alreadyLinked?: boolean;
};

export type AssessmentResultCandidate = ExternalInvitation;
