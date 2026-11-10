import type { z } from 'zod';
import type { createCvBuilderSchema } from '../validation/cv-builder-schema';

// Landing state of the CV builder: no CV yet, a finished CV, or an unfinished draft.
export type CvBuilderState = 'intro' | 'exists' | 'draft';

// How the wizard was opened: a new CV, continuing a draft, or editing a finished CV.
export type CvBuilderMode = 'new' | 'draft' | 'edit';

export type CvBuilderSummary = {
  /** Last update (finished CV) or last save (draft), shown as-is. */
  lastSavedAt: string;
  completedSteps: number;
  totalSteps: number;
};

export type CvBuilderValues = z.infer<ReturnType<typeof createCvBuilderSchema>>;

// Each wizard step owns one top-level key of the form.
export type CvBuilderStepKey = keyof CvBuilderValues;

export type CvBuilderStep = {
  key: CvBuilderStepKey;
  /** Translation key under `candidatePage.buildCv.steps`. */
  label: string;
};
