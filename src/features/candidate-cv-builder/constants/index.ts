import { CANDIDATE_ROUTES } from '@/features/candidate-profile/constants';
import type {
  CvBuilderMode,
  CvBuilderState,
  CvBuilderStep,
  CvBuilderSummary,
} from '../types/cv-builder.types';

export const CV_BUILDER_ROUTES = {
  root: CANDIDATE_ROUTES.buildCv,
  create: CANDIDATE_ROUTES.buildCvCreate,
} as const;

export const CV_BUILDER_STATES: readonly CvBuilderState[] = [
  'intro',
  'exists',
  'draft',
];

export const CV_BUILDER_MODES: readonly CvBuilderMode[] = [
  'new',
  'draft',
  'edit',
];

// Wizard opened from each landing state.
export const CV_BUILDER_MODE_BY_STATE: Record<CvBuilderState, CvBuilderMode> = {
  intro: 'new',
  exists: 'edit',
  draft: 'draft',
};

export const CV_BUILDER_STEPS: readonly CvBuilderStep[] = [
  { key: 'personal', label: 'personal', endpoint: 'step-one' },
  { key: 'contact', label: 'contact', endpoint: 'step-two' },
  { key: 'jobProfile', label: 'job-profile', endpoint: 'step-three' },
  { key: 'summary', label: 'summary', endpoint: 'step-four' },
  { key: 'educations', label: 'education', endpoint: 'step-five' },
  { key: 'certificates', label: 'certificates', endpoint: null },
  { key: 'experience', label: 'experience', endpoint: null },
  { key: 'skills', label: 'skills', endpoint: null },
  { key: 'research', label: 'research', endpoint: null },
  { key: 'conferences', label: 'conferences', endpoint: null },
];

export const CV_BUILDER_HERO_IMAGE = '/assets/build-cv/hero.png';

export const CV_BUILDER_ICONS = {
  checkCircle: '/assets/build-cv/check-circle.svg',
  clock: '/assets/build-cv/clock.svg',
  eye: '/assets/build-cv/eye.svg',
  trash: '/assets/build-cv/trash.svg',
  cameraAdd: '/assets/build-cv/camera-add.svg',
  circleX: '/assets/build-cv/circle-x.svg',
  watermark: '/assets/build-cv/cv-watermark.svg',
} as const;

// Design-only: "Download CV" returns this sample until the API generates the CV PDF.
export const CV_BUILDER_SAMPLE_CV_URL =
  '/assets/company-projects/sample-cv.pdf';

// Design-only data until the CV builder API is ready (not translated).
export const CV_BUILDER_PREVIEW_SUMMARY: CvBuilderSummary = {
  lastSavedAt: '18 Sep 2026',
  completedSteps: 5,
  totalSteps: CV_BUILDER_STEPS.length,
};

export const SKILLS_VISIBLE_COUNT = 11;
