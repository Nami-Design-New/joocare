// Step of the CV analysis on the page.
export type AtsMatchStep = 'intro' | 'analyzing' | 'results';

// What the page shows first (`?state=`); "coming-soon" is the intro with the modal open.
export type AtsMatchView = AtsMatchStep | 'coming-soon';

// "live" runs the analysis; "coming-soon" opens the Coming Soon modal instead.
export type AtsMatchMode = 'live' | 'coming-soon';

export type AtsOptimizationPoint = {
  title: string;
  text: string;
};

export type AtsMatchResult = {
  fileName: string;
  /** ATS score, 0–100. */
  score: number;
  points: AtsOptimizationPoint[];
};
