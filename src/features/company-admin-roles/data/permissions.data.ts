import type {
  CompanyRoleKey,
  RolePermissionConfig,
} from '../types/permissions.types';

// Display content from Figma. These labels are data and stay in English.
export const rolePermissions: Record<CompanyRoleKey, RolePermissionConfig> = {
  'recruitment-manager': {
    description: 'Full access to the entire platform and all actions.',
    overviewSuffix: 'Full platform access',
    groups: [
      {
        id: 'full-platform',
        title: 'Full platform access',
        description:
          'Authoritative client policy for the Recruitment Manager role.',
        highlighted: true,
        entries: [
          {
            id: 'full-access',
            value: 'Full Access to the entire data, actions on the platform.',
          },
        ],
        note: 'This modal is read-only permission viewing, not an editing form.',
      },
    ],
  },
  recruiter: {
    description: 'Hiring access with specific viewing and assessment limits.',
    groups: [
      {
        id: 'company-profile',
        title: 'Company Profile',
        entries: [
          {
            id: 'view',
            value: 'View only',
            description: 'No actions available.',
          },
        ],
      },
      {
        id: 'dashboard',
        title: 'Dashboard',
        entries: [{ id: 'view', value: 'View only' }],
      },
      {
        id: 'hiring-management',
        title: 'Hiring Management',
        entries: [
          { id: 'jobs', label: 'Jobs', value: 'Full access' },
          { id: 'projects', label: 'Projects', value: 'Full access' },
          {
            id: 'assessment',
            label: 'Assessment',
            value: 'Full access except category creation',
          },
          {
            id: 'assessment-results',
            label: 'Assessment Results',
            value: 'Full access',
          },
        ],
        notice: {
          title: 'Create Assessment Category — not permitted',
          description: 'All other Assessment permissions are available.',
        },
      },
      {
        id: 'job-posting',
        title: 'Job Posting',
        entries: [{ id: 'access', value: 'Access' }],
      },
      {
        id: 'messages',
        title: 'Messages',
        entries: [{ id: 'access', value: 'Access' }],
      },
      {
        id: 'notifications',
        title: 'Notifications',
        entries: [{ id: 'access', value: 'Access' }],
      },
    ],
  },
  'branding-specialist': {
    description: 'Full access to Company Profile only.',
    groups: [
      {
        id: 'company-profile',
        title: 'Company Profile',
        highlighted: true,
        entries: [
          { id: 'full-access', value: 'Full access' },
          { id: 'edit-profile', value: 'Edit Company Profile' },
        ],
      },
    ],
    notice: { description: 'No access to any other platform areas.' },
  },
  admin: {
    description: 'Access to company, dashboard and administration areas.',
    groups: [
      {
        id: 'company-profile',
        title: 'Company Profile',
        entries: [{ id: 'access', value: 'Access' }],
      },
      {
        id: 'dashboard',
        title: 'Dashboard',
        entries: [{ id: 'access', value: 'Access' }],
      },
      {
        id: 'admin-roles',
        title: 'Admin Roles',
        entries: [{ id: 'access', value: 'Access' }],
      },
      {
        id: 'recruiter-activity',
        title: 'Recruiter Activity',
        entries: [{ id: 'access', value: 'Access' }],
      },
    ],
  },
  'hiring-manager': {
    description:
      'Access to assigned projects only — review candidates and take hiring decisions.',
    groups: [
      {
        id: 'assigned-projects',
        title: 'Assigned Projects',
        entries: [
          {
            id: 'view',
            value: 'View only',
            description: 'Only projects assigned to this hiring manager.',
          },
        ],
      },
      {
        id: 'hiring-management',
        title: 'Hiring Management',
        entries: [
          {
            id: 'candidate-profiles',
            label: 'Candidate Profiles',
            value: 'View only',
          },
          {
            id: 'candidate-cvs',
            label: 'Candidate CVs',
            value: 'View & download',
          },
          {
            id: 'shortlist',
            label: 'Shortlist',
            value: 'Full access (shortlist / reject)',
          },
          {
            id: 'hiring-process',
            label: 'Hiring Process',
            value: 'Full access (interview scheduling & notes to recruiter)',
          },
        ],
        notice: {
          title: 'Recruiter functions — not permitted',
          description:
            'No access to Jobs, Job Posting, Assessments, Talent Database, or Messages.',
        },
      },
    ],
  },
};
