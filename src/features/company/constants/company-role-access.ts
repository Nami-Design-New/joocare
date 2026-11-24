import type { CompanyRoleKey } from '@/features/company-admin-roles/types/permissions.types';
import type { CompanyRoleAccess } from '../types/company-role-access.types';

const ACCOUNT_SETTINGS = '/company/account-settings';
const COMPANY_PROFILE = '/company/company-profile';
const DASHBOARD = '/company/dashboard';

// Page and action access per company admin role, from the role permissions
// shown on /company/roles-and-permissions (permissions.data.ts).
export const COMPANY_ROLE_ACCESS: Record<CompanyRoleKey, CompanyRoleAccess> = {
  recruitment_manager: {
    home: DASHBOARD,
    routes: 'all',
    actions: 'all',
  },
  admin: {
    home: DASHBOARD,
    routes: [
      COMPANY_PROFILE,
      DASHBOARD,
      '/company/users',
      '/company/roles-and-permissions',
      '/company/recruiter-activity',
      ACCOUNT_SETTINGS,
    ],
    actions: [],
  },
  recruiter: {
    home: DASHBOARD,
    routes: [
      COMPANY_PROFILE,
      DASHBOARD,
      '/company/job-management',
      '/company/job',
      '/company/post-job',
      '/company/candidate-profile',
      '/company/projects',
      '/company/shared-projects',
      '/company/assessments',
      '/company/assessments-results',
      '/company/chat',
      ACCOUNT_SETTINGS,
    ],
    actions: ['post-job'],
  },
  branding_specialist: {
    home: COMPANY_PROFILE,
    routes: [COMPANY_PROFILE, ACCOUNT_SETTINGS],
    actions: [],
  },
  hiring_manager: {
    home: '/company/projects',
    routes: ['/company/projects', '/company/shared-projects', ACCOUNT_SETTINGS],
    actions: [],
  },
};

// A role the frontend does not know yet only gets the company profile.
export const UNKNOWN_ROLE_ACCESS: CompanyRoleAccess = {
  home: COMPANY_PROFILE,
  routes: [COMPANY_PROFILE, ACCOUNT_SETTINGS],
  actions: [],
};
