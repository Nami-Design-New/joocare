export const CANDIDATE_JOB_SEARCH_STATUSES = [
  {
    value: 'open_to_work',
    label: 'open-to-work',
    badgeClassName: 'bg-job-status-open',
    borderClassName: 'border-job-status-open',
  },
  {
    value: 'actively_looking',
    label: 'actively-looking',
    badgeClassName: 'bg-job-status-active',
    borderClassName: 'border-job-status-active',
  },
  {
    value: 'open_to_opportunities',
    label: 'open-to-opportunities',
    badgeClassName: 'bg-job-status-passive',
    borderClassName: 'border-job-status-passive',
  },
] as const;
