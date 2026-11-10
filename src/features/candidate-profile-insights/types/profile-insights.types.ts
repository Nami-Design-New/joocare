// A company that viewed the candidate's profile.
export type ProfileViewer = {
  id: string;
  companyId: number;
  companyName: string;
  companyType: string;
  logo: string | null;
  /** ISO date of the visit. */
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
