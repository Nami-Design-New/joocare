import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import type { CandidateDecision } from '../../types/shared-review.types';

const DECISION_STYLES: Record<CandidateDecision, string> = {
  Shortlist: 'bg-primary-bg text-primary',
  'Under review': 'bg-warning/10 text-warning-strong',
  Rejected: 'bg-destructive/10 text-destructive',
};

const DECISION_LABEL_KEYS = {
  Shortlist: 'shortlisted',
  'Under review': 'under-review',
  Rejected: 'rejected',
} as const satisfies Record<CandidateDecision, string>;

type CandidateDecisionBadgeProps = {
  decision: CandidateDecision;
};

export default function CandidateDecisionBadge({
  decision,
}: CandidateDecisionBadgeProps) {
  const t = useTranslations('companyPage.projects.shared-review');

  return (
    <span
      className={cn(
        'shrink-0 rounded-md px-2.5 py-1 text-sm font-semibold whitespace-nowrap',
        DECISION_STYLES[decision],
      )}
    >
      {t(DECISION_LABEL_KEYS[decision])}
    </span>
  );
}
