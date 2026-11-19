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

export type CvBuilderRemoteData = {
  state: CvBuilderState;
  summary: CvBuilderSummary;
  /** One-based active step returned by `GET /cv/progress`. */
  currentStep: number;
  values: CvBuilderValues | null;
};

export type CvBuilderValues = z.infer<ReturnType<typeof createCvBuilderSchema>>;

export type CvSuggestedSkill = { id: string; label: string };

export type CvStepOnePayload = {
  name: string;
  image?: string;
  nationality_id: number;
  birth_date?: string;
  marital_status?: string;
  country_id: number;
  city_id: number;
  languages: Array<{
    language: string;
    proficiency_level: string;
  }>;
};

// Each wizard step owns one top-level key of the form.
export type CvBuilderStepKey = keyof CvBuilderValues;

export type CvBuilderStep = {
  key: CvBuilderStepKey;
  /** Translation key under `candidatePage.buildCv.steps`. */
  label: string;
  endpoint?: string | null;
};
