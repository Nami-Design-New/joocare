'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import type {
  AssessmentCandidateSummary,
  CandidateAssessment,
} from '../../types/candidate-assessment.types';
import {
  getAssessmentResultHref,
  hasAssessmentScore,
  SHORT_DATE_FORMAT,
} from '../../utils/candidate-assessments';
import CandidateAssessmentStatusBadge from './CandidateAssessmentStatusBadge';
import CandidateModalHeader from './CandidateModalHeader';
import CandidateSummaryCard from './CandidateSummaryCard';

type CandidateAssessmentsModalProps = {
  candidate: AssessmentCandidateSummary;
  assessments: CandidateAssessment[];
  onClose: () => void;
  onAssignAnother: () => void;
};

export default function CandidateAssessmentsModal({
  candidate,
  assessments,
  onClose,
  onAssignAnother,
}: CandidateAssessmentsModalProps) {
  const t = useTranslations('companyPage.assessments.candidate-assessments');
  const format = useFormatter();
  const formatDate = (date: string) =>
    format.dateTime(new Date(date), SHORT_DATE_FORMAT);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-card w-[calc(100%-2rem)] max-w-195 gap-6 rounded-3xl border-0 p-6 sm:min-w-0"
      >
        <CandidateModalHeader title={t('list-title')} />
        <DialogDescription className="sr-only">
          {t('list-description', { name: candidate.name })}
        </DialogDescription>
        <section className="flex flex-col gap-3">
          <h3 className="font-semibold">{t('candidate')}</h3>
          <CandidateSummaryCard candidate={candidate} />
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="font-semibold">
            {t('assessments-count', { count: assessments.length })}
          </h3>
          <ul className="flex max-h-[40vh] flex-col gap-3 overflow-y-auto">
            {assessments.map((assessment) => (
              <li
                key={assessment.id}
                className="border-border flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-semibold">{assessment.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {t(`source.${assessment.source}`)} ·{' '}
                    {t('sent', { date: formatDate(assessment.sentAt) })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <CandidateAssessmentStatusBadge status={assessment.status} />
                  {hasAssessmentScore(assessment) ? (
                    <>
                      <strong className="font-semibold">
                        {assessment.score}%
                      </strong>
                      <Link
                        href={getAssessmentResultHref(
                          assessment.assessmentId,
                          candidate.id,
                        )}
                        className="text-primary text-xs font-medium underline underline-offset-2"
                      >
                        {t('view-result')}
                      </Link>
                    </>
                  ) : assessment.dueAt ? (
                    <span className="text-muted-foreground text-xs">
                      {t('due', { date: formatDate(assessment.dueAt) })}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <Button type="button" size="pill" onClick={onAssignAnother}>
          {t('assign-another')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
