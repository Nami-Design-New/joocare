// A company that viewed the candidate's profile.
export type ProfileViewer = {
  id: string;
  companyId: number;
  companyName: string;
  companyType: string;
  logo: string | null;
  /** Date label supplied by the visits API. */
  viewedAt: string;
};

export type ProfileViewersPage = {
  viewers: ProfileViewer[];
  total: number;
  page: number;
  pageSize: number;
};

export type ProfileInsightsQuery = {
  search: string;
  page: number;
};

export type ApiProfileVisit = {
  id?: number | string;
  company?: {
    id?: number | string;
    name?: string;
    type?: string;
    image?: string | null;
  } | null;
  created_at?: string | null;
  visited_at?: string | null;
};

export type ApiProfileVisitsPage = {
  data?: ApiProfileVisit[];
  current_page?: number | string;
  per_page?: number | string;
  total?: number | string;
  last_page?: number | string;
  meta?: {
    current_page?: number | string;
    per_page?: number | string;
    total?: number | string;
    last_page?: number | string;
  };
};

export type ApiProfileVisitsResponse = ApiProfileVisit[] | ApiProfileVisitsPage;
