import type { RecruiterJobStatus } from '../types/recruiter-activity.types';

export const RECRUITER_ACTIVITY_PAGE_SIZE = 10;
export const RECRUITER_ACTIVITY_SKELETON_ROWS = 5;

export const ALL_RECRUITERS_VALUE = 'all';

export const RECRUITER_JOB_STATUSES: RecruiterJobStatus[] = [
  'open',
  'closed',
  'draft',
];
