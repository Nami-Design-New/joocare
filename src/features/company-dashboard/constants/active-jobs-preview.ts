import type { DashboardJobRow, StatisticsOverview } from '../index.type';

// Design fixtures from employer/dashboard/active-jobs for UI review (`?preview=design`).
export const activeJobsDesignOverview: StatisticsOverview = {
  total_applications: 3654,
  total_jobs: 12,
  active_jobs: 12,
  total_views: 148,
  jobs_per_day: [
    ['Sunday', 'الأحد', 34],
    ['Monday', 'الإثنين', 50],
    ['Tuesday', 'الثلاثاء', 34],
    ['Wednesday', 'الأربعاء', 52],
    ['Thursday', 'الخميس', 88],
    ['Friday', 'الجمعة', 44],
    ['Saturday', 'السبت', 59],
  ].map(([name_en, name_ar, jobs_count], index) => ({
    day: index + 1,
    name_en: String(name_en),
    name_ar: String(name_ar),
    jobs_count: Number(jobs_count),
  })),
};

export const activeJobsDesignRows: DashboardJobRow[] = [12, 24, 40].map(
  (views, index) => ({
    id: index + 1,
    title: 'Consultant Internist',
    views_num: views,
    applications_count: index + 3,
    created_at: '21 December 2026',
  }),
);
