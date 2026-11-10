import type { AtsMatchMode, AtsMatchView } from '../types/cv-match-ats.types';

// Switch to 'coming-soon' to gate the feature: "CV Analysis" then opens the Coming Soon modal.
export const CV_MATCH_ATS_MODE: AtsMatchMode = 'live';

// Design only: how long the mock analysis runs before the results show.
export const ATS_ANALYZING_DURATION_MS = 2500;

export const ATS_MATCH_VIEWS: readonly AtsMatchView[] = [
  'intro',
  'analyzing',
  'results',
  'coming-soon',
];

export const ATS_ASSETS = {
  intro: '/assets/cv-match-ats/intro-cv.png',
  analyzing: '/assets/cv-match-ats/analyzing-robot.png',
  comingSoon: '/assets/cv-match-ats/coming-soon.svg',
  pdfFile: '/assets/cv-match-ats/pdf-file.svg',
  bell: '/assets/cv-match-ats/bell.svg',
} as const;

// Intro accordion (keys under `candidatePage.cvMatchAts.features`).
export const ATS_INTRO_FEATURES = [
  'ats-compliance',
  'skills-gap',
  'improvement-tips',
] as const;

// Coming Soon modal panel (keys under `candidatePage.cvMatchAts.coming-soon.features`).
export const ATS_COMING_SOON_FEATURES = [
  { key: 'ats-compatibility', icon: '/assets/cv-match-ats/file.svg' },
  { key: 'skill-gap', icon: '/assets/cv-match-ats/chart.svg' },
  { key: 'job-match', icon: '/assets/cv-match-ats/target.svg' },
  { key: 'personalized-tips', icon: '/assets/cv-match-ats/bulb.svg' },
] as const;
