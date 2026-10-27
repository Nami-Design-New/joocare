'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Badge } from '@/shared/components/ui/badge';
import type { Assessment } from '../../types/assessment.types';
import AssessmentDetailsActions from './AssessmentDetailsActions';

export default function AssessmentDetailsHeader({
  assessment,
  isPaused,
  showActions,
}: {
  assessment: Assessment;
  isPaused: boolean;
  showActions: boolean;
}) {
  const t = useTranslations('companyPage.assessments.details');
  const format = useFormatter();
  const createdDate = format.dateTime(new Date(assessment.createdAt), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-secondary text-xl font-bold md:text-2xl">
            {assessment.title}
          </h1>
          {isPaused ? <Badge variant="paused">{t('paused')}</Badge> : null}
        </div>
        <p className="text-muted-foreground text-xs">
          {t('created-on', { date: createdDate })}
        </p>
      </div>
      {showActions ? <AssessmentDetailsActions isPaused={isPaused} /> : null}
    </header>
  );
}
