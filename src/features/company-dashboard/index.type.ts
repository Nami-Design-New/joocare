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