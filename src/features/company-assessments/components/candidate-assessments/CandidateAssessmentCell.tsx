'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CandidateAssessment } from '../../types/candidate-assessment.types';
import {
  getAssessmentResultHref,
  hasAssessmentScore,
  SHORT_DATE_FORMAT,
} from '../../utils/candidate-assessments';
import CandidateAssessmentStatusBadge from './CandidateAssessmentStatusBadge';

type CandidateAssessmentCellProps = {
  candidateId: string;
  assessments: CandidateAssessment[];
  onViewAll: () => void;
  onAssign: () => void;
};

const LINK_CLASS =
  'text-primary text-xs font-medium whitespace-nowrap underline underline-offset-2';

export default function CandidateAssessmentCell({
  candidateId,
  assessments,
  onViewAll,
  onAssign,
}: CandidateAssessmentCellProps) {
  const t = useTranslations('companyPage.assessments.candidate-assessments');
  const format = useFormatter();
  const [primary] = assessments;

  if (!primary) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <CandidateAssessmentStatusBadge status="not-assigned" />
        <button type="button" onClick={onAssign} className={LINK_CLASS}>
          + {t('share-assessment')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-2">
        <CandidateAssessmentStatusBadge status={primary.status} />
        {hasAssessmentScore(primary) && (
          <strong className="text-base font-semibold">{primary.score}%</strong>
        )}
      </div>
      {assessments.length > 1 ? (
        <button type="button" onClick={onViewAll} className={LINK_CLASS}>
          {t('view-all', { count: assessments.length })}
        </button>
      ) : hasAssessmentScore(primary) ? (
        <Link
          href={getAssessmentResultHref(primary.assessmentId, candidateId)}
          className={LINK_CLASS}
        >
          {t('view-result')}
        </Link>
      ) : primary.status === 'grace-period' && primary.dueAt ? (
        <span className="text-xs whitespace-nowrap text-muted-foreground">
          {t('due', {
            date: format.dateTime(new Date(primary.dueAt), SHORT_DATE_FORMAT),
          })}
        </span>
      ) : primary.status === 'absent' ? (
        <span className="text-xs whitespace-nowrap text-muted-foreground">
          {t('time-expired')}
        </span>
      ) : null}
    </div>
  );
}
