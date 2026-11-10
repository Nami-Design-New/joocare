import type { CompanyMember } from '../types/member.types';
import { sampleCompanyRoles } from '@/features/company-admin-roles/data/roles.data';

const examples: Omit<CompanyMember, 'id'>[] = [
  {
    name: 'Ahmed Abdulmajeed Eltatawy',
    email: 'Ahmed@mail.com',
    phone: '+9665462123331',
    date: '21 December 2026, 4:00 AM',
    role: 'Recruitment Manager',
    displayedRoleName: 'Recruitment Manager',
  },
  {
    name: 'Ahmed Abdulmajeed Eltatawy',
    email: 'Mail@mail.com',
    phone: '+9665462123331',
    date: '21 December 2026, 4:00 AM',
    role: 'Recruiter',
    displayedRoleName: 'Recruiter',
  },
  {
    name: 'Ahmed Abdulmajeed Eltatawy',
    email: 'Mail@mail.com',
    phone: '+9665462123331',
    date: '21 December 2026, 4:00 AM',
    role: 'Branding Specialist',
    displayedRoleName: 'Branding Specialist',
  },
  {
    name: 'Ahmed Abdulmajeed Eltatawy',
    email: 'Mail@mail.com',
    phone: '+9665462123331',
    date: '21 December 2026, 4:00 AM',
    role: 'Admin',
    displayedRoleName: 'Admin',
  },
  {
    name: 'Ahmed Abdulmajeed Eltatawy',
    email: 'Mail@mail.com',
    phone: '+9665462123331',
    date: '21 December 2026, 4:00 AM',
    role: 'Hiring Manager',
    displayedRoleName: 'Hiring Manager',
  },
];

export const sampleCompanyMembers: CompanyMember[] = Array.from(
  { length: 10 },
  (_, index) => {
    const example = examples[index % examples.length];
    const cycle = Math.floor(index / examples.length);

    return {
      ...example,
      id: index + 1,
      email:
        cycle === 0
          ? example.email
          : example.email.replace('@', `+${cycle}@`),
    };
  },
);

export const companyMemberRoles = sampleCompanyRoles.map(({ name }) => name);
