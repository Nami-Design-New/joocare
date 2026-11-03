import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import type { CandidateAssessmentFilterStatus } from '../../types/candidate-assessment.types';

const STATUS_STYLES: Record<CandidateAssessmentFilterStatus, string> = {
  passed: 'bg-success/10 text-success',
  failed: 'bg-destructive/10 text-destructive',
  'grace-period': 'bg-warning/10 text-warning-strong',
  absent: 'bg-muted text-assessment-absent',
  'not-assigned': 'bg-muted text-muted-foreground',
};

type CandidateAssessmentStatusBadgeProps = {
  status: CandidateAssessmentFilterStatus;
};

export default function CandidateAssessmentStatusBadge({
  status,
}: CandidateAssessmentStatusBadgeProps) {
  const t = useTranslations('companyPage.assessments.candidate-assessments');

  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
        STATUS_STYLES[status],
      )}
    >
      {t(`status.${status}`)}
    </span>
  );
}
