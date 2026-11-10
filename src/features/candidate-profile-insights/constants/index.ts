import { CANDIDATE_ROUTES } from '@/features/candidate-profile/constants';

export const PROFILE_VIEWERS_PAGE_SIZE = 5;

export const PROFILE_VIEWER_DEFAULT_LOGO = '/assets/comp-logo.svg';

export const PROFILE_INSIGHTS_ROUTES = {
  root: CANDIDATE_ROUTES.profileInsights,
  companyProfile: (companyId: number) => `/shared-company-profile/${companyId}`,
} as const;
