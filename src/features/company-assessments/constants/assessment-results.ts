import type { AssessmentResultStatusApi } from '../types/assessment-results.types';
import type { InvitationStatus } from '../types/assessment-invitation.types';

export const ASSESSMENT_RESULTS_PAGE_SIZE = 10;
export const ASSESSMENT_LIST_OPTIONS_PAGE_SIZE = 20;
export const ASSESSMENT_LIST_QUERY_KEY = 'assessments-list';
export const RESULT_QUESTIONS_PAGE_SIZE = 6;
export const ASSESSMENT_RESULTS_HREF = '/company/assessments-results';
// `?external=1`: the results page shows only external invitations.
export const EXTERNAL_PARAM = 'external';
export const HTTP_NOT_FOUND = 404;
export const MAX_QUERY_RETRIES = 3;

export const RESULT_STATUS_FROM_API: Record<
  AssessmentResultStatusApi,
  InvitationStatus
> = {
  pending: 'pending',
  invitation_pending: 'invitation_pending',
  passed: 'passed',
  failed: 'failed',
  absent: 'absent',
};

export const RESULT_STATUS_FILTERS: InvitationStatus[] = [
  'pending',
  'invitation_pending',
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
  {
    key: 'invitation-pending',
    stat: 'invitation_pending',
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
