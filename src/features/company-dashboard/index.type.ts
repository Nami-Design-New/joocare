export type activeJobType = {
  id: number;
  jobTitle: string;
  jobViews: number;
  applicants: number;
  postedSince: string;
  cvUrl?: string;
};

export type CompanyJob = {
  id: number;
  title: string | null;
  job_title_id: number;
  job_title: {
    id: number;
    title: string;
  };
  applications_count: number;
  views_num: number;
  created_at: string;
};

export type DashboardCategory = { category_title: string; percentage: number };
export type CompanyDashboardApi = {
  active_jobs?: number | string;
  total_applications?: number | string;
  applications_this_week?: number | string;
  applications_latest_activity?: number | string;
  cvs_downloaded?: number | string;
  categories_percentage?: DashboardCategory[];
};
export type DashboardPeriodKey =
  | 'applications'
  | 'timeToFill'
  | 'reach'
  | 'intake'
  | 'recruiters';
export type DashboardPeriodOption = { value: string; label: string };
export type DashboardHiringAlert = {
  id: string;
  title: string;
  company: string;
  publishedAt: string;
  openDays: number;
  href: string;
};
export type DashboardRecruiter = {
  id: string;
  name: string;
  jobsPosted: number;
};
export type DashboardJobsPage = {
  data: CompanyJob[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  per_page: number;
  total: number;
};
