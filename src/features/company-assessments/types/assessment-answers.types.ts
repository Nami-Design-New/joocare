import type { BaseSyntheticEvent } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { InvitationStatus } from './assessment-invitation.types';

export type AssessmentAnswerOption = {
  id: string;
  text: string;
};

export type AssessmentAnswerQuestion = {
  id: string;
  number: number;
  text: string;
  multiple: boolean;
  /** Yes/No options arrive as raw "yes"/"no" and are shown translated. */
  yesNo?: boolean;
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

export type AssessmentNoteFormValues = { text: string };

// What the header shows; filled by the results API or by preview data.
export type AssessmentResultHeaderData = {
  candidate: {
    name: string;
    email: string;
    image: string | null;
    status: InvitationStatus;
  };
  scorePercent: number | null;
  assessmentTitle: string;
  assessmentHref?: string;
  sentAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  durationSeconds: number;
  counts: { correct: number; wrong: number; missing: number };
  totalQuestions: number;
};

// Notes list + form, backed by the API or by local preview state.
export type AssessmentNotesState = {
  notes: AssessmentNote[];
  form: UseFormReturn<AssessmentNoteFormValues>;
  editingId: string | null;
  isSaving: boolean;
  deletingId: string | null;
  saveNote: (event?: BaseSyntheticEvent) => Promise<void>;
  cancelEdit: () => void;
  editNote: (note: AssessmentNote) => void;
  deleteNote: (id: string) => void;
};
