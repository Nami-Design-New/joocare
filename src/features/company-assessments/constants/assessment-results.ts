import type {
  AssessmentResultStatusApi,
  CandidateLinkTarget,
} from '../types/assessment-results.types';
import type { InvitationStatus } from '../types/assessment-invitation.types';

export const ASSESSMENT_RESULTS_PAGE_SIZE = 10;
export const ASSESSMENT_LIST_OPTIONS_PAGE_SIZE = 20;
export const ASSESSMENT_LIST_QUERY_KEY = 'assessments-list';
export const RESULT_QUESTIONS_PAGE_SIZE = 6;
export const ASSESSMENT_RESULTS_HREF = '/company/assessments-results';
export const HTTP_NOT_FOUND = 404;
export const MAX_QUERY_RETRIES = 3;

export const RESULT_STATUS_FROM_API: Record<
  AssessmentResultStatusApi,
  InvitationStatus
> = {
  pending: 'pending',
  passed: 'passed',
  failed: 'failed',
  absent: 'absent',
};

export const RESULT_STATUS_FILTERS: InvitationStatus[] = [
  'pending',
  'passed',
  'failed',
  'absent',
];

// Order and colors of the stat cards above the results table.
export const RESULT_SUMMARY_ITEMS = [
  { key: 'total', stat: 'total', className: 'text-assessment-dark' },
  {
    key: 'pending-summary',
    stat: 'pending',
    className: 'text-assessment-warning',
  },
  { key: 'passed', stat: 'passed', className: 'text-assessment-primary' },
  { key: 'failed', stat: 'failed', className: 'text-assessment-error' },
  {
    key: 'absent-summary',
    stat: 'absent',
    className: 'text-assessment-absent',
  },
] as const;

// Preview data until the candidate linking APIs are available.
export const candidateLinkTargets: Record<
  'job' | 'project',
  CandidateLinkTarget[]
> = {
  job: [
    {
      id: 'staff-nurse-icu',
      name: 'Staff Nurse – ICU',
      organization: 'King Fahd Medical City',
      location: 'Riyadh',
      associatedCount: 34,
    },
    {
      id: 'senior-clinical-pharmacist',
      name: 'Senior Clinical Pharmacist',
      organization: 'Dr. Sulaiman Al Habib Hospital',
      location: 'Jeddah',
      associatedCount: 12,
    },
    {
      id: 'er-registered-nurse',
      name: 'ER Registered Nurse',
      organization: 'Saudi German Hospital',
      location: 'Dammam',
      associatedCount: 21,
      alreadyLinked: true,
    },
    {
      id: 'home-care-nurse',
      name: 'Home-care Nurse',
      organization: 'Cleveland Clinic Abu Dhabi',
      location: 'Abu Dhabi',
      associatedCount: 8,
    },
  ],
  project: [
    {
      id: 'icu-staffing-q4-2026',
      name: 'ICU Staffing – Q4 2026',
      organization: 'King Fahd Medical City',
      location: '',
      associatedCount: 18,
    },
    {
      id: 'pharmacy-network-expansion',
      name: 'Pharmacy Network Expansion',
      organization: 'Dr. Sulaiman Al Habib Hospital',
      location: '',
      associatedCount: 9,
    },
    {
      id: 'hajj-season-medical-team-2027',
      name: 'Hajj Season Medical Team 2027',
      organization: 'Ministry of Health – Makkah',
      location: '',
      associatedCount: 42,
      alreadyLinked: true,
    },
    {
      id: 'home-care-nursing-program',
      name: 'Home-care Nursing Program',
      organization: 'Cleveland Clinic Abu Dhabi',
      location: '',
      associatedCount: 6,
    },
  ],
};

export const LINKING_RECRUITER_NAME = 'Mona Al-Harbi (Recruiter)';
