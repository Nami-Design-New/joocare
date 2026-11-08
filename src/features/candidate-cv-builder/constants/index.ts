import type {
  CvBuilderState,
  CvBuilderSummary,
} from '../types/cv-builder.types';

export const CV_BUILDER_ROUTES = {
  root: '/candidate/build-cv',
  create: '/candidate/build-cv/create',
  preview: '/candidate/build-cv/preview',
} as const;

export const CV_BUILDER_STATES: readonly CvBuilderState[] = [
  'intro',
  'exists',
  'draft',
];

export const CV_BUILDER_HERO_IMAGE = '/assets/build-cv/hero.png';

export const CV_BUILDER_ICONS = {
  sparkle: '/assets/build-cv/sparkle.svg',
  checkCircle: '/assets/build-cv/check-circle.svg',
  clock: '/assets/build-cv/clock.svg',
  eye: '/assets/build-cv/eye.svg',
  trash: '/assets/build-cv/trash.svg',
} as const;

// Design-only data until the CV builder API is ready (not translated).
export const CV_BUILDER_PREVIEW_SUMMARY: CvBuilderSummary = {
  lastSavedAt: '18 Sep 2026',
  completedSteps: 5,
  totalSteps: 10,
};
