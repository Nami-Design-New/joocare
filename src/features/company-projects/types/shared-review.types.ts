import type { ProjectCandidate } from './company-projects.types';

export type CandidateDecision = ProjectCandidate['status'];

export type SharedReviewCandidate = ProjectCandidate & {
  specialty: string;
  experience: string;
  image: string;
};

export type SharedReviewStep = 'review' | 'schedule';

export type InterviewMethod = 'online' | 'face-to-face';

export type SharedReviewSummary = {
  shortlisted: number;
  rejected: number;
};
