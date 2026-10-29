import type { ExternalInvitation } from './assessment-invitation.types';

export type AssessmentAnswerOption = {
  id: string;
  text: string;
};

export type AssessmentAnswerQuestion = {
  id: string;
  number: number;
  text: string;
  multiple: boolean;
  options: AssessmentAnswerOption[];
  correctOptionIds: string[];
  selectedOptionIds: string[];
  points: number;
  maxPoints: number;
  optional?: boolean;
  image?: { src: string; width: number; height: number; description: string };
  initiallyCollapsed?: boolean;
};

export type AssessmentNote = {
  id: string;
  author: string;
  initials: string;
  role: string;
  createdAt: string;
  text: string;
  edited?: boolean;
};

export type CandidateAssessmentResult = {
  candidate: ExternalInvitation;
  assessmentTitle: string;
  assessmentHref?: string;
  backHref: string;
  sentAt: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  questions: AssessmentAnswerQuestion[];
};

export type CandidateAssessmentPageProps = {
  assessmentId: string;
  candidateId: string;
  categoryId?: string;
};

export type AssessmentNoteFormValues = { text: string };
