import type { CompanyRole } from '../types/role.types';

// Figma sample rows; replace with the company roles API when it is available.
export const sampleCompanyRoles: CompanyRole[] = [
  {
    id: 1,
    key: 'recruitment-manager',
    name: 'Recruitment Manager',
    memberCount: 3,
  },
  { id: 2, key: 'recruiter', name: 'Recruiter', memberCount: 2 },
  {
    id: 3,
    key: 'branding-specialist',
    name: 'Branding Specialist',
    memberCount: 1,
  },
  { id: 4, key: 'admin', name: 'Admin', memberCount: 3 },
  { id: 5, key: 'hiring-manager', name: 'Hiring Manager', memberCount: 0 },
];
