import { dashboardDesignJobs } from './dashboard-preview';

// Design fixtures from employer/dashboard/active-jobs; awaiting an API contract.
export const activeJobsPreviewStats = [
  { key: 'total-jobs', value: 12, icon: 'active-jobs' },
  { key: 'active-jobs', value: 12, icon: 'activity' },
  { key: 'total-applicants', value: 3654, icon: 'applications' },
  { key: 'total-job-views', value: 148, icon: 'total-job-views' },
] as const;

export const activeJobsPreviewRows = dashboardDesignJobs.slice(0, 3);

export const weeklyActivityPreview = [
  59, 44, 34, 34, 34, 50, 34, 34, 34, 34, 52, 88,
].map((value, index) => ({ position: index, value }));

// Labels sit at the centre of each day band in the design.
export const weeklyActivityDays = Array.from({ length: 7 }, (_, index) => ({
  position: ((index + 0.5) / 7) * (weeklyActivityPreview.length - 1),
  date: new Date(Date.UTC(2026, 8, 5 + index)),
}));
