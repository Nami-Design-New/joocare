import type {
  AssignmentCandidate,
  ExternalInvitation,
} from '../types/assessment-invitation.types';

export const ASSESSMENT_ASSETS = '/assets/company-assessments/figma';

// Figma preview fixtures, consistent with the existing assessment library seeds.
export const assignmentCandidates: AssignmentCandidate[] = [
  {
    id: 'ahmed',
    name: 'Ahmed Abdulmajeed Eltatwy',
    shortName: 'Ahmed A.',
    country: 'United Kingdom',
    email: 'mail.mail@nhs.uk',
    image: 'candidate-ahmed.png',
  },
  {
    id: 'sarah',
    name: 'Sarah Mahmoud',
    shortName: 'Sarah M.',
    country: 'United Arab Emirates',
    email: 'sarah@joocare.com',
    image: 'candidate-sarah.png',
  },
  {
    id: 'mohamed',
    name: 'Mohamed Khalil',
    shortName: 'Mohamed K.',
    country: 'Egypt',
    email: 'mohamed@care.org',
    image: 'candidate-mohamed.png',
  },
  {
    id: 'lina',
    name: 'Lina Hassan',
    shortName: 'Lina H.',
    country: 'Jordan',
    email: 'lina@hospital.org',
    image: 'candidate-sarah.png',
  },
  {
    id: 'omar',
    name: 'Omar Fayed',
    shortName: 'Omar F.',
    country: 'Egypt',
    email: 'omar@clinic.com',
    image: 'candidate-ahmed.png',
  },
  {
    id: 'mariam',
    name: 'Mariam Saleh',
    shortName: 'Mariam S.',
    country: 'Saudi Arabia',
    email: 'mariam@health.sa',
    image: 'candidate-sarah.png',
  },
];

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

export const externalInvitationSummary = [
  { key: 'total', count: 52, className: 'text-assessment-dark' },
  { key: 'pending-summary', count: 12, className: 'text-assessment-warning' },
  { key: 'passed', count: 28, className: 'text-assessment-primary' },
  { key: 'failed', count: 7, className: 'text-assessment-error' },
  { key: 'absent-summary', count: 5, className: 'text-assessment-absent' },
] as const;
