import type { ExternalInvitation } from '../types/assessment-invitation.types';

export const ASSESSMENT_ASSETS = '/assets/company-assessments/figma';
export const EXTERNAL_INVITATIONS_PAGE_SIZE = 10;

export const ASSIGNMENT_CANDIDATES_PAGE_SIZE = 100;
export const ASSIGNMENT_CANDIDATES_QUERY_KEY =
  'assessment-assignment-candidates';

export const externalInvitationSeeds: ExternalInvitation[] = [
  {
    id: '1',
    name: 'Dr. Ahmed Mansour',
    email: 'a.mansour@joocare.com',
    image: 'ahmed-mansour.png',
    status: 'passed',
    date: '2026-09-18T09:00:00Z',
    score: 92,
    project: 'clinical',
  },
  {
    id: '2',
    name: 'Dr. Laila Hegazi',
    email: 'l.hegazi@gmail.com',
    image: 'laila-hegazi.png',
    status: 'failed',
    date: '2026-09-17T14:15:00Z',
    score: 54,
    project: 'clinical',
  },
  {
    id: '3',
    name: 'Dr. Kareem El-Sherif',
    email: 'kareem.sherif@hotmail.com',
    image: 'kareem-el-sherif.png',
    status: 'passed',
    date: '2026-09-16T11:40:00Z',
    score: 88,
    project: 'nursing',
  },
  {
    id: '4',
    name: 'Youssef Daoud',
    email: 'youssef_daoud@outlook.com',
    image: 'youssef-daoud.png',
    status: 'pending',
    date: '2026-09-14T16:05:00Z',
    score: null,
    project: 'clinical',
  },
  {
    id: '5',
    name: 'Nour El-Din',
    email: 'nour.eldin@outlook.com',
    image: 'nour-el-din.png',
    status: 'absent',
    date: '2026-09-12T10:30:00Z',
    score: null,
    project: 'nursing',
  },
];
