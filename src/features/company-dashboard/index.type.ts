export type CompanyJob = {
  id: number;
  title: string | null;
  job_title_id: number | null;
  job_title: { id: number; title: string } | null;
  applications_count: number;
  views_num: number;
  /** Display text formatted by the server, e.g. "17 November 2026". */
  created_at: string;
};

export type DashboardMonthFilter = {
  filter_month: string;
  filter_month_label: string;
  previous_month_label: string;
};

export type DashboardMonthlyMetric = DashboardMonthFilter & {
  value: number;
  previous: number;
  /** Percent change from the previous month. Can be negative. */
  growth_rate: number;
};

export type DashboardJobDuration = DashboardMonthFilter & {
  average_hours: number;
  average_days: number;
  closed_jobs_count: number;
};

export type DashboardRecentActivity = {
  count_today: number;
  /** Display text formatted by the server, or null when there is none. */
  last_activity_at: string | null;
};

export type DashboardStaleJob = {
  id: number;
  title: string;
  specialty_id: number | null;
  specialty: string | null;
  /** Display text formatted by the server. */
  opened_at: string;
  days_open: number;
};

export type DashboardStaleJobs = {
  total: number;
  has_more: boolean;
  jobs: DashboardStaleJob[];
};

export type DashboardCategory = {
  category_id: number;
  category_title: string;
  count: number;
  percentage: number;
};

export type CompanyDashboard = {
  active_jobs: number;
  recent_activity: DashboardRecentActivity;
  total_applications: DashboardMonthlyMetric;
  job_duration: DashboardJobDuration;
  cv_downloads: DashboardMonthlyMetric;
  user_visits: DashboardMonthlyMetric;
  stale_jobs: DashboardStaleJobs;
  categories_percentage: DashboardCategory[];
};

export type DashboardMonths = {
  applications: string;
  duration: string;
  cvDownloads: string;
  visits: string;
};

export type DashboardPeriodKey = keyof DashboardMonths | 'recruiters';

export type DashboardAdminJobs = {
  admin_id: number;
  admin_name: string;
  jobs_count: number;
};

export type DashboardPage<T> = {
  data: T[];
  currentPage: number;
  perPage: number;
  total: number;
};
