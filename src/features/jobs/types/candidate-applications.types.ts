export type CandidateApplicationsTab = 'saved' | 'applied';

// Presentation contract for assessment status; awaiting the applications API contract.
export type ApplicationAssessment = {
  status: 'pending' | 'completed' | 'expired';
  href?: string;
};

export type CandidateApplicationsPageProps = {
  locale: string;
  tab: CandidateApplicationsTab;
  page: number;
  search: string;
};
