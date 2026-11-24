export type RecruiterJobStatus = 'open' | 'closed' | 'draft';

export type ApiRecruiterStats = {
  id: number;
  name: string;
  is_deleted?: boolean;
  open_jobs: number;
  closed_jobs: number;
  draft_jobs: number;
  projects: number;
};

export type ApiRecruitersStatsPage = {
  data: ApiRecruiterStats[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type RecruiterActivity = {
  id: number;
  name: string;
  isDeleted: boolean;
  jobs: Record<RecruiterJobStatus, number>;
  projects: number;
};

export type RecruiterActivityPage = {
  recruiters: RecruiterActivity[];
  total: number;
  perPage: number;
  lastPage: number;
};

export type RecruiterOption = {
  id: number;
  name: string;
};
